import { Locator, Page } from "@playwright/test/types/test";

export class LobbyPage {
    username: string;
    lobbySetupDone: boolean;


    //locators
    private setName: Locator;
    private cookieAcceptButton: Locator;
    private nextButton: Locator;
    private enterButton: Locator;
    private grantCameraNMicrophone: Locator;

    // page
    page: Page;

    constructor(page: Page) {
        this.page = page;

        // defaults
        this.username = "Unset User"


        //locators
        this.setName = page.locator("input[class='ant-input css-d4akvj mousetrap input--full-width']");
        this.cookieAcceptButton = page.locator('button:has-text(" I accept cookies")');
        this.nextButton = page.locator('button:has-text("Next")');
        this.enterButton = page.locator('button:has-text("Enter")');
        this.grantCameraNMicrophone = page.locator("button:has-text('Grant access to cam and mic')");
        this.lobbySetupDone = false;
    }

    async visit() {
        await this.page.goto("https://test.fres.co/43f19f31-f72c-4af2-9ca6-ded0655e366c");
    }


    async setUsername(username) {
        this.username = username;
    }


    async setupLobby(): Promise<void> {

        const username = this.username;

        await this.cookieAcceptButton.click();

        await this.setName.clear();
        await this.setName.type(username);
        this.username = username;
        await this.nextButton.click();

        let buttonVisible;
        try {
            buttonVisible = await this.grantCameraNMicrophone.waitFor({ state: "visible", timeout: 5000 });
            if (buttonVisible) {
                await this.grantCameraNMicrophone.click();
            }
        } catch (error) {
            // handle the error here
        }

        await this.nextButton.click();
        await this.nextButton.click();
        await this.enterButton.click();
        this.lobbySetupDone = true;
    }


}