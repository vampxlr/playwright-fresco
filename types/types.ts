import { BrowserContext, Page } from "@playwright/test"
import { MeetingPage } from "../pageobjects/MeetingPage"

// needs to be moved somewhere else
export interface MeetingPageContext {
  meetingPage: MeetingPage
  context: BrowserContext
  page: Page
}

export interface CoOrdinates {
  x: number
  y: number
}