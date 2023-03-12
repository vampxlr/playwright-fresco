import { Locator, Page } from "@playwright/test/types/test";
import { LobbyPage } from "./LobbyPage";
import { CoOrdinates } from '../types/types'



interface Coordinate {
  x: number;
  y: number;
}

interface Position {
  position: string;
  element: string;
}
export class MeetingPage extends LobbyPage {
  avatarVisible: boolean;
  meetingPageLoaded: boolean;
  centerOfAvatar: CoOrdinates;
  page: Page;


  //locators
  dragableAvatar: Locator;
  videoExpandButton: Locator;
  videoCompressButton: Locator;
  settingsButton: Locator;
  mutedMicrophoneButton: Locator;
  otherAvatars: Locator;
  participantVideoSpace: Locator;
  microphoneButton: Locator;
  videoCameraButton: Locator;
  screenShareButton: Locator;
  sideBar: Locator;
  lockButton: Locator;
  resizeHandles: Locator;


  // resize-buttons
  nwResizeButton: Locator;
  nResizeButton: Locator;
  neResizeButton: Locator;
  wResizeButton: Locator;
  eResizeButton: Locator;
  swResizeButton: Locator;
  sResizeButton: Locator;
  seResizeButton: Locator;

  helpers: { centerOf: (element: any) => Promise<{ x: any; y: any; }>; delay: (milliseconds: any) => Promise<unknown>; };


  constructor(page) {
    super(page)
    this.page = page;

    //locators

    //avatars
    this.dragableAvatar = page.locator('.conference-video__border.border--on-canvas.border--draggable');
    this.otherAvatars = page.locator('div.conference-video__border[style*="background-color: rgb(255, 255, 255)"]');

    //buttons
    this.videoExpandButton = page.locator('.fa.fa-expand');
    this.videoCompressButton = page.locator('.fa.fa-compress');
    this.settingsButton = page.locator('i.material-icons:has-text("Build")')
    this.screenShareButton = page.locator('i.material-icons:has-text("present_to_all")')
    this.mutedMicrophoneButton = page.locator('.fa.fa-microphone-slash');
    this.microphoneButton = page.locator('.fa.fa-microphone');
    this.videoCameraButton = page.locator('.fa.fa-video-camera');

    // screen space
    this.participantVideoSpace = page.locator('.widget__body.l-fill');
    this.sideBar = page.locator('.ant-layout-sider');


    //architect buttons
    this.lockButton = page.locator('.fa.fa-lock');
    this.resizeHandles = page.locator('.resize-handle');

    // resize buttons
    this.nwResizeButton = page.locator('.resize-handle[style*="cursor: nw-resize"]');
    this.nResizeButton = page.locator('.resize-handle[style*="cursor: n-resize"]');
    this.neResizeButton = page.locator('.resize-handle[style*="cursor: ne-resize"]');
    this.wResizeButton = page.locator('.resize-handle[style*="cursor: w-resize"]');
    this.eResizeButton = page.locator('.resize-handle[style*="cursor: e-resize"]');
    this.swResizeButton = page.locator('.resize-handle[style*="cursor: sw-resize"]');
    this.sResizeButton = page.locator('.resize-handle[style*="cursor: s-resize"]');
    this.seResizeButton = page.locator('.resize-handle[style*="cursor: se-resize"]');



    // helpers 

    this.helpers = {
      centerOf: async (element) => {
        const box = await element.boundingBox();

        const boxXCenter = box.x + box.width / 2;
        const boxYCenter = box.y + box.height / 2;
        return { x: boxXCenter, y: boxYCenter };
      },
      delay: async (milliseconds) => {
        return await new Promise((resolve) => setTimeout(resolve, milliseconds));
      }
    }


  }

  async getArchButtonByText(text): Promise<Locator> {
    let button = this.page.locator(`span.ant-tree-title >> span:text("${text}")`);
    return button;
  }

  async getClassFromLocator(locator: Locator) {
    const string: string | null = locator.toString();
    const selector = string.replace('Locator@', '');
    return selector;
  }


  async isDragAbleAvatarVisible(): Promise<boolean> {

    if (this.avatarVisible !== true || this.meetingPageLoaded !== true) {
      await this.dragableAvatar.waitFor({ state: "visible", timeout: 20000 });

      this.avatarVisible = await this.dragableAvatar.isVisible();
    }
    return this.avatarVisible;
  }

  async loadAvatarLocation(): Promise<CoOrdinates> {
    let position = await this.getCenterOfElement(this.dragableAvatar);
    this.centerOfAvatar = position;
    return position;
  }

  async getCenterOfElement(locator: Locator): Promise<CoOrdinates> {

    const box = await locator.boundingBox();
    let position: CoOrdinates = { x: 0, y: 0 }
    if (box !== null) {
      const boxXCenter = box.x + box.width / 2;
      const boxYCenter = box.y + box.height / 2;
      position = { x: boxXCenter, y: boxYCenter };
    }
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

  async positionOfAnotherAvatarFirst() {
    let position = (await this.otherAvatars.first().boundingBox());
    return position;
  }

  async boundingBoxParticipantVideo() {
    let area = (await this.participantVideoSpace.first().boundingBox());
    return area;
  }



  async dragAvatar(direction: string = "right", distance: number = 300): Promise<void> {
    const selector = await this.getClassFromLocator(this.dragableAvatar);
    if (selector) {
      await this.drag(selector, distance, direction)
    } else {
      console.log("selector empty");
    }
  }


  async getElementByTagWithAttrValue(htmlTag, attribute, value) {
    const element = await this.page.locator(`//${htmlTag}[@${attribute}="${value}"]`);
    return element;
  }

  async drag(selector, distance, direction) {
    await this.page.waitForSelector(selector); // wait for selector is important, it checks whether the selector is visible
    
    const element = await this.page.$(selector);
    const center = await this.helpers.centerOf(element);

    await this.page.mouse.move(center.x, center.y); // click center
    await this.page.mouse.down();
    await this.helpers.delay(5000);

    if (direction === "right") {
      await this.page.mouse.move(center.x + distance, center.y, { steps: 10 }) // move right
    }
    else if (direction === "top") {
      await this.page.mouse.move(center.x, (center.y - distance), { steps: 10 }) // move top
   
    }
    else if (direction === "bottom") {

      await this.page.mouse.move(center.x, center.y + distance, { steps: 10 }) // move bottom
    } else if (direction === "left") {
      await this.page.mouse.move(center.x - distance, center.y, { steps: 10 }) // move left
    }
    await this.helpers.delay(5000);
    await this.page.mouse.up();
  }

}