import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FollowingFeedComponent } from './components/following-feed/following-feed.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PostsComponent } from './components/posts/posts.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [

    { path : '', component : HomeComponent, canActivate: [AuthGuardService] },
    { path : 'home', component : HomeComponent, canActivate: [AuthGuardService] },
    { path : 'following', component : FollowingFeedComponent, canActivate: [AuthGuardService] },
    { path : 'signup', component : SignupComponent },
    { path : 'login', component : LoginComponent },
    { path : 'posts', component : PostsComponent, canActivate: [AuthGuardService] },
    { path : 'create-post', component : CreatePostComponent, canActivate: [AuthGuardService] },
    { path : '**', redirectTo : '/home' }

];

