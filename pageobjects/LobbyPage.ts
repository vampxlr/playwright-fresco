import { Locator } from "@playwright/test/types/test";

export class LobbyPage {
    username: string;
    lobbySetupDone: boolean;
    
    
    //locators
    setName: Locator;
    cookieAcceptButton: Locator;
    nextButton: Locator;
    enterButton: Locator;
    grantCameraNMicrophone: Locator;
    avatar: Locator;
    page: any;
    
    constructor(page) {
        this.page = page;

        //locators
        this.setName = page.locator("input[class='ant-input css-d4akvj mousetrap input--full-width']");
        this.cookieAcceptButton = page.locator('button:has-text(" I accept cookies")');
        this.nextButton = page.locator('button:has-text("Next")');
        this.enterButton = page.locator('button:has-text("Enter")');
        this.grantCameraNMicrophone = page.locator("button:has-text('Grant access to cam and mic')");
        this.lobbySetupDone = false;
    }

    async goto() {
        await this.page.goto("https://test.fres.co/43f19f31-f72c-4af2-9ca6-ded0655e366c"); 
    }


    async setupLobby(username : string): Promise<void> {


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
            console.log('Timed out waiting for button:', error);
            // handle the error here
        }

        await this.nextButton.click();
        await this.nextButton.click();
        await this.enterButton.click();

    }


}