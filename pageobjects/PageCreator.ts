import { Browser, BrowserContext, Locator, Page } from "@playwright/test/types/test";
import { LobbyPage } from "./LobbyPage";
import { HomePage } from "./HomePage";
import { LoginPage } from "./LoginPage";
import { MeetingPage } from "./MeetingPage";
import { SignUpPage } from "./SignUpPage";
import { SpacePage } from "./SpacePage";
import { MeetingPageContext } from "../types/types";

export class PageCreator {
    page: any;
    loginPage: LoginPage;
    lobbyPage: LobbyPage;
    homePage: HomePage;
    meetingPage: MeetingPage;
    signUpPage: SignUpPage;
    spacePage: SpacePage;
    browser: Browser;
    constructor(browser) {
        this.browser = browser;
    }

    async createMeetingPageContext(username): Promise<MeetingPageContext> {
        const context: BrowserContext = await this.browser.newContext();
        context.grantPermissions(['microphone', 'camera']);
        const page: Page = await context.newPage();
        const meetingPage = new MeetingPage(page);
        await meetingPage.visit();
        await meetingPage.setUsername(username);
        await meetingPage.setupLobby();
        return { meetingPage, context, page };
    }


}
