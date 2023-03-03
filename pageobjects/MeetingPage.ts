import { Locator } from "@playwright/test/types/test";
import { LobbyPage } from "./LobbyPage";

// needs to be moved somewhere else
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

     async trackAvatar(): Promise<boolean> {

        const box = await this.dragableAvatar.boundingBox();
            let position: CoOrdinates = { x: 0, y: 0 }
            if (box !== null) {
                const boxXCenter = box.x + box.width / 2;
                const boxYCenter = box.y + box.height / 2;
                position = { x: boxXCenter, y: boxYCenter };
            }
            this.centerOfAvatar = position;
            return box !==null;
    }


    async dragAvatar(direction:string = "right", distance:number = 300): Promise<void> {
        await this.trackAvatar();
        const center = this.centerOfAvatar;
        await this.page.mouse.move(center.x, center.y)
        await this.page.mouse.down();

        if (direction === "right") {
            await this.page.mouse.move(center.x + distance, center.y) // move right
        }
        else if (direction === "top") {
            await this.page.mouse.move(center.x, center.y - distance) // move top
        }
        else if (direction === "bottom") {

            await this.page.mouse.move(center.x, center.y + distance) // move bottom
        } else if (direction === "left") {
            await this.page.mouse.move(center.x - distance, center.y) // move left
        }
        await this.page.waitForTimeout(5000);
        await this.page.mouse.up();

    }

}