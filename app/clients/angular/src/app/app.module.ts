import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* As of Angular 14, this is the best-practices way to make forms in Angular */
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './main/header/header.component';
import { AsideComponent } from './main/aside/aside.component';
import { ContentComponent } from './main/content/content.component';
import { FooterComponent } from './main/footer/footer.component';
import { Child1Component } from './main/content/child1/child1.component';
import { Child2Component } from './main/content/child2/child2.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotFoundComponent } from './not-found/not-found.component';
import { NetworkRequestButtonComponent } from './reusable/ui/network-request-button/network-request-button.component';
import { MessageItemComponent } from './main/header/message-item/message-item.component';
import { NotificationBellComponent } from './main/header/notification-bell/notification-bell.component';
import { ProfilePicComponent } from './main/header/profile-pic/profile-pic.component';
import { SettingsComponent } from './main/user/settings/settings.component';
import { ProfileComponent } from './main/user/profile/profile.component';
import { BillingComponent } from './main/account/billing/billing.component';
import { UsersComponent } from './main/content/sysadmin/users/users.component';
import { AccountsComponent } from './main/content/sysadmin/accounts/accounts.component';
import { SubscriptionsComponent } from './main/content/sysadmin/subscriptions/subscriptions.component';
import { ApikeysComponent } from './main/content/sysadmin/apikeys/apikeys.component';
import { PlanmanagementComponent } from './main/content/sysadmin/planmanagement/planmanagement.component';
import { ReportsComponent } from './main/content/sysadmin/reports/reports.component';
import { TransactionsComponent } from './main/content/sysadmin/transactions/transactions.component';
import { HelpDashboardComponent } from './main/content/help/dashboard/dashboard.component';
import { FreePlanPageComponent } from './main/content/plans/free/free.component';
import { ProPlanPageComponent } from './main/content/plans/pro/pro.component';
import { EnterprisePlanPageComponent } from './main/content/plans/enterprise/enterprise.component';
import { TermsComponent } from './main/content/terms/terms.component';
import { PrivacyComponent } from './main/content/terms/privacy/privacy.component';

import { FlextableComponent } from './reusable/ui/flextable/flextable.component';

/* Angular Material Imports */
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';


import { ReplaceUnderscorePipe } from './legacy/custom_pipe/allpipe';
import { ViewDropdownComponent } from './legacy/flex-components/view-dropdown/view-dropdown.component';
import { FlexDropdownComponent } from './legacy/flex-components/flex-dropdown/flex-dropdown.component';
import { DynamicPriceComponent } from './legacy/flex-components/dynamic-price/dynamic-price.component';
import { FlexMenuComponent } from './legacy/flex-components/flex-menu/view-dropdown.component';
import { FileUploadComponent } from './legacy/file-upload/file-upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgLetModule } from 'ng-let';
import { TableLoadingButtonComponent } from './reusable/ui/table-loading-button/table-loading-button.component';
import { PlanComponent } from './main/content/sysadmin/planmanagement/plan/plan.component';
import { PanelComponent } from './main/content/sysadmin/subscriptions/panel/panel.component';
import { DomainsComponent } from './main/content/affiliate/domains/domains.component';
import { SignupsComponent } from './main/content/affiliate/signups/signups.component';
import { GetpaidComponent } from './main/content/affiliate/getpaid/getpaid.component';
import { TrialsComponent } from './main/content/affiliate/trials/trials.component';
import { CookiesComponent } from './main/content/affiliate/cookies2/cookies2.component';
import { AffiliateHomeComponent } from './main/content/affiliate/home/home.component';
import { UserHomeComponent } from './main/content/user/home/home.component';
import { AdminHomeComponent } from './main/content/sysadmin/home/home.component';
import { GenericLoadingButtonComponent } from './reusable/ui/generic-loading-button/generic-loading-button.component';
import { AddDomainComponent } from './main/content/affiliate/domains/add-domain/add-domain.component';
import { NotificationsComponent } from './main/notifications/notifications.component';
import { MessagesComponent } from './main/messages/messages.component';
import { ButtonComponent } from './reusable/ui/trash/button/button.component';
import { ForumComponent } from './main/forum/forum.component';
import { ThreadComponent } from './main/forum/thread/thread.component';
import { RowbuttonComponent } from './reusable/ui/flextable/rowbutton/rowbutton.component';
import { ChatComponent } from './chat/chat.component';
import { PromptPlaygroundComponent } from './reusable/ui/prompt-playground/prompt-playground.component';
import { PromptsComponent } from './main/content/sysadmin/prompts/prompts.component';
import { VideoComponentComponent } from './reusable/ui/video-component/video-component.component';
import { MarketplaceComponent } from './main/content/marketplace/marketplace.component';
import { OffersComponent } from './main/content/marketplace/flextables/offers/offers.component';
import { ProposalsComponent } from './main/content/marketplace/flextables/proposals/proposals.component';
import { NeedsComponent } from './main/content/marketplace/flextables/needs/needs.component';
import { EscrowComponent } from './main/content/marketplace/flextables/escrow/escrow.component';
import { MyproposalsComponent } from './main/content/marketplace/flextables/myproposals/myproposals.component';
import { MyoffersComponent } from './main/content/marketplace/flextables/myoffers/myoffers.component';
import { DrawerComponent } from './main/content/marketplace/flextables/offers/drawer/drawer.component';
import { LinkGuidelinesComponent } from './main/content/help/link-guidelines/link-guidelines.component';
import { PostRequestComponent } from './main/content/marketplace/post-request/post-request.component';
import { ProposeExchangeComponent } from './main/content/marketplace/propose-exchange/propose-exchange.component';
import { VariableStateButtonComponent } from './reusable/ui/buttons/variable-state-button/variable-state-button.component';

import { JoyrideModule } from 'ngx-joyride';
import { PostOfferComponent } from './main/content/marketplace/post-offer/post-offer.component';
import { TableBadgesComponent } from './reusable/ui/buttons/table-badges/table-badges.component';
import { SnakeCasePupePipe } from './snake-case-pupe.pipe';
import { OfferDetailsComponent } from './main/content/marketplace/offer-details/offer-details.component';
import { PermissionsCellComponent } from './reusable/ui/flextable/permissions-cell/permissions-cell.component';
import { QualityCheckComponent } from './main/content/sysadmin/quality-check/quality-check.component';
import { UpgradePlanComponent } from './main/account/billing/upgrade-plan/upgrade-plan.component';
import { FaqComponent } from './main/content/help/faq/faq.component';
import { VoteComponent } from './main/content/help/vote/vote.component';
import { BallotComponent } from './main/content/help/vote/ballot/ballot.component';
import { RoadmapComponent } from './main/content/help/roadmap/roadmap.component';
import { OnboardingComponent } from './main/content/help/onboarding/onboarding.component';
import { HowtouseComponent } from './main/content/help/howtouse/howtouse.component';
import { WebsiteComponent } from './website/website.component';
import { PreregisterComponent } from './website/preregister/preregister.component';
import { LinkAlgorithmComponent } from './website/link-algorithm/link-algorithm.component';
import { YourfullschoolComponent } from './website/yourfullschool/yourfullschool.component'

@NgModule({
  declarations: [
    /* Angular Framework */
 
    /* Old Client Ports */
    ReplaceUnderscorePipe,
    ViewDropdownComponent,
    FlexDropdownComponent,
    DynamicPriceComponent,
    FlexMenuComponent,
    FileUploadComponent,

    /* Project */
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    HeaderComponent,
    AsideComponent,
    ContentComponent,
    FooterComponent,
    Child1Component,
    Child2Component,
    NotFoundComponent,
    NetworkRequestButtonComponent,
    MessageItemComponent,
    NotificationBellComponent,
    ProfilePicComponent,
    SettingsComponent,
    ProfileComponent,
    BillingComponent,
    UsersComponent,
    AccountsComponent,
    SubscriptionsComponent,
    ApikeysComponent,
    PlanmanagementComponent,
    ReportsComponent,
    TransactionsComponent,
    HelpDashboardComponent,
    FreePlanPageComponent,
    ProPlanPageComponent,
    EnterprisePlanPageComponent,
    TermsComponent,
    PrivacyComponent,
    FlextableComponent,
    TableLoadingButtonComponent,
    PlanComponent,
    PanelComponent,
    DomainsComponent,
    SignupsComponent,
    GetpaidComponent,
    TrialsComponent,
    CookiesComponent,
    AdminHomeComponent,
    UserHomeComponent,
    AffiliateHomeComponent,
    GenericLoadingButtonComponent,
    AddDomainComponent,
    NotificationsComponent,
    MessagesComponent,
    ButtonComponent,
    ForumComponent,
    ThreadComponent,
    RowbuttonComponent,
    ChatComponent,
    PromptPlaygroundComponent,
    PromptsComponent,
    VideoComponentComponent,
    MarketplaceComponent,
    OffersComponent,
    ProposalsComponent,
    NeedsComponent,
    EscrowComponent,
    MyproposalsComponent,
    MyoffersComponent,
    DrawerComponent,
    LinkGuidelinesComponent,
    PostRequestComponent,
    ProposeExchangeComponent,
    VariableStateButtonComponent,
    PostOfferComponent,
    TableBadgesComponent,
    SnakeCasePupePipe,
    OfferDetailsComponent,
    PermissionsCellComponent,
    QualityCheckComponent,
    UpgradePlanComponent,
    FaqComponent,
    VoteComponent,
    BallotComponent,
    RoadmapComponent,
    OnboardingComponent,
    HowtouseComponent,
    WebsiteComponent,
    PreregisterComponent,
    LinkAlgorithmComponent,
    YourfullschoolComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    /* Angular Material */
    MatSidenavModule, 
    MatButtonModule,
    MatIconModule,   
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatDialogModule,
    MatInputModule,
    MatStepperModule,
    /* A 3rd party module that allows us to use *ngLet to make Angular variables.  Very useful */
    NgLetModule,

    /* JoyRide */
    JoyrideModule.forRoot(),
  ],
  exports: [ ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
