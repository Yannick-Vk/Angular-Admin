import {Routes} from '@angular/router';
import {LoginForm} from './pages/login/LoginForm';
import {RegisterForm} from './pages/register/register';
import {Users} from './pages/users/users';
import {HomeComponent} from './pages/home/home';
import {authGuard} from './guards/auth-guard';
import {Roles} from './pages/roles/roles';
import {RoleHasUsers} from './pages/roles/role-has-users/role-has-users';
import {Logout} from './pages/logout/logout';
import {UserInfo} from './pages/users/user-info/user-info';
import {UploadBlog} from "./components/blog/upload-blog/upload-blog";
import {Blogs} from './pages/blogs/blogs';
import {MyBlogs} from './pages/my-blogs/my-blogs';
import {EditBlog} from './pages/my-blogs/edit-blog/edit-blog';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    'component': HomeComponent,
  }, {
    'path': 'Login',
    'component': LoginForm,
  }, {
    'path': 'Register',
    'component': RegisterForm,
  },{
    path: 'Logout',
    component: Logout,
  }, {
    'path': 'Users',
    'component': Users,
    'canActivate': [authGuard],
  },{
    'path': 'Users/:userName',
    'component': UserInfo,
    'canActivate': [authGuard],
  }, {
    'path': 'Roles',
    'component': Roles,
    'canActivate': [authGuard],
  }, {
    'path': 'Roles/:roleName',
    'component': RoleHasUsers,
    'canActivate': [authGuard],
  }, {
    path: 'Blogs/Upload',
    component: UploadBlog,
    canActivate: [authGuard],
  }, {
    path: 'Blogs/:blogId',
    component: Blogs,
  }, {
    path: 'Blogs',
    redirectTo: '/Home',
  }, {
    path: 'Home',
    redirectTo: '',
  }, {
    path: 'Blog/Me',
    component: MyBlogs,
    canActivate: [authGuard],
  }, {
    path: 'Blog/Me/Edit/:blogId',
    component: EditBlog,
    canActivate: [authGuard],
  },
];
