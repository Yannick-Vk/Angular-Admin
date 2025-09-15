import {Component, computed, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {AddRole} from './add-role/add-role';
import {Router} from '@angular/router';
import {RoleService} from '../../services/role-service';
import {Role, RoleDto, UserWithRoleDto} from '../../models/Role';
import {Table} from '../../components/table/table';
import {AddRoleToUser} from './add-role-to-user/add-role-to-user';
import {Modal} from '../../components/modal/modal';

@Component({
    selector: 'roles',
    imports: [
        AddRole,
        Table,
        AddRoleToUser,
        Modal
    ],
    templateUrl: './roles.html',
    styleUrl: './roles.scss'
})
export class Roles {
    roleService = inject(RoleService);
    router = inject(Router);
    roles: WritableSignal<Array<Role>> = signal([]);
    roleNames = computed(() => this.roles().map(role => role.name));
    roleToDelete: WritableSignal<string | null> = signal(null);

    errorMessage = signal<string | undefined>(undefined);
    successMessage = signal<string | undefined>(undefined);

    @ViewChild('confirmDelete') confirmDeleteModal!: Modal;

    constructor() {
        this.getRoles();
    }

    getRoles() {
        this.roleService.GetRoles().subscribe({
            next: (roles) => {
                this.roles.set(roles);
            },
            error: (err) => {
                console.error('Error getting roles:', err);
            }
        });
    }

    CreateNewRole(roleName: string) {
        this.roleService.CreateNewRole(new RoleDto(roleName)).subscribe({
            next: () => {
                this.getRoles();
            },
            error: (err) => {
                console.error('Error adding role:', err);
            }
        });
    }

    deleteRole(roleName: string) {
        this.roleToDelete.set(roleName);
        this.openConfirmModal(`Deleting role ${roleName}`, `Are you sure you want to delete role ${roleName}?`);
    }

    addRoleToUser(data: { RoleName: string, Username: string }) {
        this.successMessage.set(undefined);

        const dto = new UserWithRoleDto(data.RoleName, data.Username);
        this.roleService.AddRoleToUser(dto).subscribe({
            next: () => {
                this.successMessage.set("Added role")
            },
            error: (err) => {
                console.error('Error adding role to user:', err);
                this.errorMessage.set(err.error)
            }
        });
    }

    showInfo(role: Role) {
        this.router.navigate([`/Roles/${role.name}`]).then()
    }

    openConfirmModal(title: string, message: string) {
        this.confirmDeleteModal.title.set(title);
        this.confirmDeleteModal.message.set(message);
        this.confirmDeleteModal.open();
    }

    confirmRoleDelete() {
        const roleName = this.roleToDelete();
        if (roleName) {
            this.roleService.DeleteRole(new RoleDto(roleName)).subscribe({
                next: () => {
                    this.getRoles();
                    this.confirmDeleteModal.close();
                    this.roleToDelete.set(null);
                },
                error: (err) => {
                    console.error('Error deleting role:', err);
                    this.confirmDeleteModal.close();
                    this.roleToDelete.set(null);
                }
            });
        }
    }

    cancelRoleDelete() {
        this.confirmDeleteModal.close();
        this.roleToDelete.set(null);
    }

}
