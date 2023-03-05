import { Locator, Page } from "@playwright/test/types/test";
import { LobbyPage } from "./LobbyPage";
import { CoOrdinates } from '../types/types'

export class MeetingPage extends LobbyPage {
    avatarVisible: boolean;
    meetingPageLoaded: boolean;
    centerOfAvatar: CoOrdinates;


    dragableAvatar: Locator;
    page: Page;
    videoExpandButton: Locator;
    videoCompressButton: Locator;
    settingsButton: any;
    mutedMicrophoneButton: any;


    constructor(page) {
        super(page)
        this.page = page;

        //locators
        this.dragableAvatar = page.locator('.conference-video__border.border--on-canvas.border--draggable');
        this.videoExpandButton = page.locator('.fa.fa-expand');
        this.videoCompressButton = page.locator('.fa.fa-compress');
        this.settingsButton = page.locator('.material-icons');
        this.mutedMicrophoneButton = page.locator('fa.fa-microphone-slash');
    }


    async isDragAbleAvatarVisible(): Promise<boolean> {

        if (this.avatarVisible !== true || this.meetingPageLoaded !== true) {
            await this.dragableAvatar.waitFor({ state: "visible", timeout: 20000 });

            this.avatarVisible = await this.dragableAvatar.isVisible();
        }
        return this.avatarVisible;
    }

    async loadAvatarLocation(): Promise<CoOrdinates> {

        const box = await this.dragableAvatar.boundingBox();
        let position: CoOrdinates = { x: 0, y: 0 }
        if (box !== null) {
            const boxXCenter = box.x + box.width / 2;
            const boxYCenter = box.y + box.height / 2;
            position = { x: boxXCenter, y: boxYCenter };
        }
        this.centerOfAvatar = position;
        return position;
    }


    async currentAvatarLocation(): Promise<CoOrdinates> {
        await this.loadAvatarLocation();
        return this.centerOfAvatar;
    }

    async clickBySelectorFirst(selector): Promise<void> {
        this.page.locator(selector).first().click();
    }

    async clickVideoExpandButton() {
        await this.videoExpandButton.click();
    }

    async clickVideoCompressButton() {
        await this.videoCompressButton.click();
    }


    async dragAvatar(direction: string = "right", distance: number = 300): Promise<void> {
        await this.loadAvatarLocation();
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
        await this.loadAvatarLocation();

    }

}