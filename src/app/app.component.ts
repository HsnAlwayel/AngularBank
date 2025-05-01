import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TableModule, InputTextModule],
  template: `
    <div class="p-4">
      <input
        type="text"
        pInputText
        placeholder="Global Search..."
        (input)="onGlobalFilterChange($event)"
        class="mb-2"
      />

      <p-table
        [value]="users"
        [filters]="filters"
        [globalFilterFields]="['name', 'email']"
        [paginator]="true"
        [rows]="5"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="id">ID <p-sortIcon field="id" /></th>
            <th pSortableColumn="name">Name <p-sortIcon field="name" /></th>
            <th pSortableColumn="email">Email <p-sortIcon field="email" /></th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-user>
          <tr>
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
})
export class AppComponent {
  filters: any = {};
  users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 4, name: 'Dana White', email: 'dana@example.com' },
    { id: 5, name: 'Eve Black', email: 'eve@example.com' },
    { id: 6, name: 'Frank Blue', email: 'frank@example.com' },
    { id: 7, name: 'Grace Green', email: 'grace@example.com' },
  ];

  onGlobalFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.filters['global'] = { value: value, matchMode: 'contains' };
  }
}
