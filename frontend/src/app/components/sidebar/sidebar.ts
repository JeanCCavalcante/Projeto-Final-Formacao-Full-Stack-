import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  activeLink: string | null = null;

  pagesLinks = [
    {
      name: 'Métricas',
      route: '/overview',
      icon: 'ph-light:chart-pie',
      iconActive: 'ph-fill:chart-pie',
    },
    {
      name: 'Tarefas',
      route: '/integrations',
      icon: 'ph-light:check-square',
      iconActive: 'ph-fill:check-square',
    },
    {
      name: 'Mentorados',
      route: '/customers',
      icon: 'ph-light:chalkboard-teacher',
      iconActive: 'ph-fill:chalkboard-teacher',
    },
    {
      name: 'Configurações',
      route: '/settings',
      icon: 'ph-light:gear-six',
      iconActive: 'ph-fill:gear-six',
    },
    {
      name: 'Perfil',
      route: '/account',
      icon: 'ph-light:user-circle',
      iconActive: 'ph-fill:user-circle',
    },
  ];
}
