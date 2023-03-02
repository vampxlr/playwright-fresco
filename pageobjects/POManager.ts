import { Locator } from "@playwright/test/types/test";
import { LobbyPage } from "./LobbyPage";
import { HomePage } from "./HomePage";
import { LoginPage } from "./LoginPage";
import { MeetingPage } from "./MeetingPage";
import { SignUpPage } from "./SignUpPage";
import { SpacePage } from "./SpacePage";

export class POManager {
    page: any;
    loginPage: LoginPage;
    lobbyPage: LobbyPage;
    homePage: HomePage;
    meetingPage: MeetingPage;
    signUpPage: SignUpPage;
    spacePage: SpacePage;
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.lobbyPage = new LobbyPage(this.page);
        this.homePage = new HomePage(this.page);
        this.meetingPage = new MeetingPage(this.page);
        this.signUpPage = new SignUpPage(this.page);
        this.spacePage = new SpacePage(this.page);
    }

    getLoginPage() {
        return this.loginPage;
    }

    getLobbyPage() {
        return this.lobbyPage;
    }

    getHomePage() {
        return this.homePage;
    }
    getMeetingPage() {
        return this.meetingPage;
    }

    getSignUpPage() {
        return this.signUpPage;
    }

    getSpacePage() {
        return this.spacePage;
    }
}
module.exports = { POManager };