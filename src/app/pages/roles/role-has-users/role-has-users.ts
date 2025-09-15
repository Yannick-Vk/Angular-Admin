import {Component, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {RoleService} from '../../../services/role-service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../models/Users';
import {Table} from '../../../components/table/table';
import {UserWithRoleDto} from '../../../models/Role';
import {Modal} from "../../../components/modal/modal";

@Component({
    selector: 'app-role-has-users',
    imports: [
        Table,
        Modal
    ],
    templateUrl: './role-has-users.html',
    styleUrl: './role-has-users.scss'
})
export class RoleHasUsers {
    roleService = inject(RoleService);
    router = inject(Router);
    users: WritableSignal<Array<User>> = signal([]);
    role!: string;
    userToRemove: WritableSignal<string | null> = signal(null);
    @ViewChild('confirmDelete') confirmDeleteModal!: Modal;
    private route = inject(ActivatedRoute);

    constructor() {
        const roleName = this.route.snapshot.paramMap.get('roleName');
        if (!roleName) {
            return
        }
        this.role = roleName;
        this.getUsers(this.role);
    }

    getUsers(roleName: string = this.role) {
        this.roleService.GetUsersWithRole(roleName).subscribe({
            next: (users) => {
                this.users.set(users);
            },
            error: (err) => {
                console.error('Error getting users:', err);
            }
        })
    }

    openConfirmationModal(username: string) {
        this.userToRemove.set(username);
        this.confirmDeleteModal.title.set('Confirm Removal');
        this.confirmDeleteModal.message.set(`Are you sure you want to remove the role '${this.role}' from user '${username}'?`);
        this.confirmDeleteModal.open();
    }

    confirmRemove() {
        const username = this.userToRemove();
        if (!username) return;

        this.roleService.RemoveRoleFromUser(new UserWithRoleDto(this.role, username)).subscribe({
            next: (_) => {
                this.getUsers()
                this.confirmDeleteModal.close();
                this.userToRemove.set(null);
            },
            error: (err) => {
                console.error('Error removing role from user:', err);
                this.confirmDeleteModal.close();
                this.userToRemove.set(null);
            }
        })
    }

    cancelRemove() {
        this.confirmDeleteModal.close();
        this.userToRemove.set(null);
    }

    async back() {
        await this.router.navigate(['/Roles']);
    }

    async details(username: string) {
        await this.router.navigate([`/Users/${username}`]);
    }
}
