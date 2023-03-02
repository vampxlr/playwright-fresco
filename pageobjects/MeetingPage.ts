import { Locator } from "@playwright/test/types/test";
import { LobbyPage } from "./LobbyPage";

interface CoOrdinates {
    x: number
    y: number
  }


export class MeetingPage extends LobbyPage {
    avatarVisible: boolean;
    meetingPageLoaded: boolean;
    centerOfAvatar: CoOrdinates;


    dragableAvatar: Locator;
    page: any;
   

    constructor(page){
        super(page)
        this.page = page;
        //locators
        this.dragableAvatar = page.locator('.conference-video__border.border--on-canvas.border--draggable');
    }


    async waitForPageToload(): Promise<boolean> {

        if (this.avatarVisible !== true || this.meetingPageLoaded !== true) {
            await this.dragableAvatar.waitFor({ state: "visible", timeout: 20000 });

            this.avatarVisible = await this.dragableAvatar.isVisible();       
        }

        return this.avatarVisible;

    }

    async trackAvatar(): Promise<void> {

        const box = await this.dragableAvatar.boundingBox();
            let position: CoOrdinates = { x: 0, y: 0 }
            if (box !== null) {
                const boxXCenter = box.x + box.width / 2;
                const boxYCenter = box.y + box.height / 2;
                position = { x: boxXCenter, y: boxYCenter };
            }
            this.centerOfAvatar = position;

    }


    async dragAvatar(direction:string = "right"): Promise<void> {

        await this.page.mouse.move(this.centerOfAvatar.x, this.centerOfAvatar.y)
        await this.page.mouse.down();

        await this.page.mouse.move(this.centerOfAvatar.x + 300, this.centerOfAvatar.y)
        await this.page.waitForTimeout(2000);
        await this.page.mouse.up();

    }

}