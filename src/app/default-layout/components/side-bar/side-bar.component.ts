import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  ItemInterface,
  MenuInterface
} from '../../../shared/interfaces/menu.interface';
import {
  MENU_CONST,
  ROLE_PERMISSIONS
} from '../../../shared/constants/menu.constants';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import { UserComplete } from '../../../organizational/interfaces/create.interface';
import { UsersService } from '../../../organizational/services/users.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    MatButtonModule,
    MatIconModule,
    FontAwesomeModule,
    RouterLink,
    MatMenuModule,
    NgFor,
    MatTooltipModule,
    CommonModule,
    LoaderComponent
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  animations: [
    trigger('submenuState', [
      state('closed', style({ maxHeight: '0px', opacity: 0 })),
      state('open', style({ maxHeight: '500px', opacity: 1 })),
      transition('closed <=> open', [animate('0.3s ease-in-out')])
    ])
  ]
})
export class SideBarComponent implements OnInit, OnChanges {
  /** Trigger del menú contextual */
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  /** Datos básicos del usuario logueado (usado para cargar datos completos) */
  @Input() userRole?: UserInterface;

  /** Escucha si el sidebar debe cerrarse desde el padre */
  @Input() closeSideBar: boolean = false;

  /** Evento emitido al colapsar o expandir el sidebar */
  @Output() collapsed: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Evento emitido para cerrar sesión */
  @Output() logout = new EventEmitter<void>();

  /** Router para detectar rutas activas */
  private readonly _router: Router = inject(Router);

  /** Servicio para obtener datos completos del usuario */
  private readonly _usersService: UsersService = inject(UsersService);

  isCollapsed: boolean = true;
  currentRoute: string = '';
  menuWithItems: MenuInterface[] = [];
  itemSelected: string | null = null;
  moduleSelected: string | null = null;
  currentYear: number = new Date().getFullYear();
  openSubMenu: Record<string, boolean> = {};
  userComplete?: UserComplete;
  isLoading: boolean = false;

  /**
   * Método del ciclo de vida que inicializa el componente:
   * - Guarda la ruta actual
   * - Escucha cambios de ruta
   * - Carga los datos completos del usuario si hay un ID
   * - Filtra el menú según el rol
   */
  ngOnInit(): void {
    this.currentRoute = this._router.url;

    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this._router.url;
      });

    if (this.userRole?.userId) {
      this.isLoading = true;
      this._usersService.getUserEditPanel(this.userRole.userId).subscribe({
        next: (res) => {
          this.userComplete = res.data;
          this.filterMenuByRole();
          this.isLoading = false;
        },
        error: () => {
          this.menuWithItems = [];
          this.isLoading = false;
        }
      });
    } else {
      this.menuWithItems = [];
    }
  }

  /**
   * Detecta cambios en los `@Input()`.
   * Si se cierra el sidebar desde el padre, lo cierra localmente también.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['closeSideBar'] && this.closeSideBar) {
      this.closeSideBarMethod();
    }
  }

  /**
   * Filtra los módulos y items del menú según los permisos del rol actual.
   */
  private filterMenuByRole(): void {
    const roleName = this.userComplete?.roleType?.name;
    if (!roleName) {
      this.menuWithItems = [];
      return;
    }

    const allowedItems = ROLE_PERMISSIONS[roleName];

    this.menuWithItems = MENU_CONST.map((module) => ({
      ...module,
      items: module.items
        .map((item) => ({
          ...item,
          subItems: item.subItems?.filter((sub) =>
            allowedItems.includes(sub.name)
          )
        }))
        .filter(
          (item) =>
            allowedItems.includes(item.name) ||
            (item.subItems && item.subItems.length > 0)
        )
    })).filter((module) => module.items.length > 0);
  }

  /**
   * Alterna entre colapsar y expandir el sidebar.
   * Cierra los submenús si se colapsa.
   */
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) this.closeAllSubMenus();
    this.collapsed.emit(this.isCollapsed);
  }

  /**
   * Cierra el sidebar desde una señal externa (`closeSideBar`).
   */
  closeSideBarMethod(): void {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) this.closeAllSubMenus();
  }

  /** Cierra todos los submenús */
  closeAllSubMenus(): void {
    this.openSubMenu = {};
  }

  /**
   * Alterna un submenú solo si el sidebar está expandido.
   * @param item - Item del menú para alternar subitems
   */
  toggleSubMenu(item: ItemInterface): void {
    if (!this.isCollapsed) {
      this.openSubMenu[item.name] = !this.openSubMenu[item.name];
    }
  }

  /**
   * Verifica si una ruta está activa (para marcar estilos activos en el menú)
   * @param routeElement - Fragmento de la ruta a comparar
   */
  getActiveElement(routeElement?: string): boolean {
    if (!routeElement) return false;
    return this.currentRoute.includes(routeElement);
  }

  /**
   * Cierra el menú contextual manualmente.
   */
  closeMenu(): void {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
  }
}
