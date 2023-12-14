import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainComponent } from './main/main.component';
import { Child1Component } from './main/content/child1/child1.component';
import { Child2Component } from './main/content/child2/child2.component';
import { NotFoundComponent } from './not-found/not-found.component'
import { ProfileComponent } from './main/user/profile/profile.component'
import { SettingsComponent } from './main/user/settings/settings.component'
import { BillingComponent } from './main/account/billing/billing.component'
import { UpgradePlanComponent } from './main/account/billing/upgrade-plan/upgrade-plan.component'
import { UsersComponent } from './main/content/sysadmin/users/users.component' 
import { AccountsComponent } from './main/content/sysadmin/accounts/accounts.component' 
import { ApikeysComponent } from './main/content/sysadmin/apikeys/apikeys.component' 
import { PlanmanagementComponent } from './main/content/sysadmin/planmanagement/planmanagement.component' 
import { ReportsComponent } from './main/content/sysadmin/reports/reports.component' 
import { TransactionsComponent } from './main/content/sysadmin/transactions/transactions.component' 
import { SubscriptionsComponent } from './main/content/sysadmin/subscriptions/subscriptions.component' 
import { HelpDashboardComponent } from './main/content/help/dashboard/dashboard.component'

/* Plan Features Pages */
import { FreePlanPageComponent } from './main/content/plans/free/free.component'
import { ProPlanPageComponent } from './main/content/plans/pro/pro.component'
import { EnterprisePlanPageComponent } from './main/content/plans/enterprise/enterprise.component'

/* Legal Pages */
import { TermsComponent } from './main/content/terms/terms.component'
import { PrivacyComponent } from './main/content/terms/privacy/privacy.component'

/* Legacy Components */
import { SharedService } from './legacy/_services/shared.service';

import { FormsModule } from "@angular/forms"

/* Admin */
import { PlanComponent } from './main/content/sysadmin/planmanagement/plan/plan.component';
import { QualityCheckComponent } from './main/content/sysadmin/quality-check/quality-check.component';

/* Affiliate */
import { CookiesComponent } from './main/content/affiliate/cookies2/cookies2.component'
import { DomainsComponent } from './main/content/affiliate/domains/domains.component'
import { GetpaidComponent } from './main/content/affiliate/getpaid/getpaid.component'
import { SignupsComponent } from './main/content/affiliate/signups/signups.component'
import { TrialsComponent } from './main/content/affiliate/trials/trials.component'

/* Home Routes */
import { AffiliateHomeComponent } from './main/content/affiliate/home/home.component';
import { UserHomeComponent } from './main/content/user/home/home.component';
import { AdminHomeComponent } from './main/content/sysadmin/home/home.component';

/* Notifications and Messages */
import { NotificationsComponent } from './main/notifications/notifications.component';
import { MessagesComponent } from './main/messages/messages.component';

/* Community Forum */
import { ForumComponent } from './main/forum/forum.component'
import { ThreadComponent } from './main/forum/thread/thread.component'

/* Prompt Playground */
import { PromptsComponent } from './main/content/sysadmin/prompts/prompts.component';
import { PromptPlaygroundComponent } from './reusable/ui/prompt-playground/prompt-playground.component';

import { MarketplaceComponent } from './main/content/marketplace/marketplace.component'
import { OfferDetailsComponent } from './main/content/marketplace/offer-details/offer-details.component'

/* Help */
import { LinkGuidelinesComponent } from './main/content/help/link-guidelines/link-guidelines.component'
import { FaqComponent } from './main/content/help/faq/faq.component'
import { VoteComponent } from './main/content/help/vote/vote.component'
import { RoadmapComponent } from './main/content/help/roadmap/roadmap.component'
import { OnboardingComponent } from './main/content/help/onboarding/onboarding.component'
import { HowtouseComponent } from './main/content/help/howtouse/howtouse.component'

/* Website */
import { WebsiteComponent } from './website/website.component'

import { YourfullschoolComponent } from './website/yourfullschool/yourfullschool.component'

import { LinkAlgorithmComponent } from './website/link-algorithm/link-algorithm.component'

const routes: Routes = [  
  /* Public Routes */
  { path: 'application', component: WebsiteComponent },
  { path: 'yourfullschool', component: YourfullschoolComponent },
  { path: 'public/application/link-requirements', component: LinkGuidelinesComponent },
  { path: 'public/application/link-algorithm', component: LinkAlgorithmComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  // { path: 'register-affiliate', redirectTo: 'register', pathMatch: 'full' },

  /* Authenticated Routes */
  {
    path: 'main',
    redirectTo: 'main/child1', // Redirect /main to /main/child1
    pathMatch: 'full'
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'terms/privacy',
    component: PrivacyComponent
  },
  { path: 'onboarding', component: OnboardingComponent },
  {
    path: 'main',
    component: MainComponent,
    children: [

      { path: 'upgrade', component: UpgradePlanComponent },

      /* Help */
      { path: 'faq', component: FaqComponent },
      { path: 'vote', component: VoteComponent },
      { path: 'howtouse', component: HowtouseComponent },


      /* Marketplace */
      { path: 'marketplace', component: MarketplaceComponent },
      { path: 'marketplace/offer-details', component: OfferDetailsComponent },
      { path: 'marketplace/offer-details/id/:id', component: OfferDetailsComponent },
      { path: 'help/link-guidelines', component: LinkGuidelinesComponent },
      /* Forum */
      { path: 'forum', component: ForumComponent },
      { path: 'forum/thread', component: ThreadComponent },
      { path: 'forum/thread/id/:id', component: ThreadComponent },

      /* Notifications */
      { path: 'notifications', component: NotificationsComponent },
      { path: 'messages', component: MessagesComponent },

      /* Home Routes */
      { path: 'affiliate/home', component: AffiliateHomeComponent },
      { path: 'admin/home', component: AdminHomeComponent },
      { path: 'user/home', component: UserHomeComponent },

      /* Test Routes To Delete */
      { path: 'child1', component: Child1Component },
      { path: 'child2', component: Child2Component },

      /* User Settings Routes */
      { path: 'user/profile', component: ProfileComponent },
      { path: 'user/settings', component: SettingsComponent },
      { path: 'account/billing', component: BillingComponent },

      /* SysAdmin Routes */
      { path: 'sysadmin/users', component: UsersComponent },
      { path: 'sysadmin/accounts', component: AccountsComponent },
      { path: 'sysadmin/subscriptions', component: SubscriptionsComponent },
      { path: 'sysadmin/apikeys', component: ApikeysComponent },
      { path: 'sysadmin/planmanagement', component: PlanmanagementComponent },
      { path: 'sysadmin/planmanagement/plan/id/:id', component: PlanComponent },
      { path: 'sysadmin/reports', component: ReportsComponent },
      { path: 'sysadmin/transactions', component: TransactionsComponent },
      { path: 'sysadmin/prompts', component: PromptsComponent },
      { path: 'sysadmin/prompts/id/:id', component: PromptPlaygroundComponent },
      { path: 'sysadmin/quality', component: QualityCheckComponent },

      /* Affiliate Routes */
      { path: 'affiliate/cookies', component: CookiesComponent },
      { path: 'affiliate/domains', component: DomainsComponent },
      { path: 'affiliate/signups', component: SignupsComponent },
      { path: 'affiliate/getpaid', component: GetpaidComponent },
      { path: 'affiliate/trials', component: TrialsComponent },
      { path: 'affiliate/connected', component: TrialsComponent },

      /* Help Content Routes */
      { path: 'help/dashboard', component: HelpDashboardComponent },

      /* Plan Features Pages */
      { path: 'plans/free', component: FreePlanPageComponent },
      { path: 'plans/pro', component: ProPlanPageComponent },
      { path: 'plans/enterprise', component: EnterprisePlanPageComponent }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

   { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled'}), FormsModule],
  declarations: [

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
