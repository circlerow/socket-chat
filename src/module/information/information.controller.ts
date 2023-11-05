import { Body, Controller, Get, Post } from "@nestjs/common";
import { Message } from "../../schema";
import { InformationService } from "./information.service";

@Controller("information")
export class InformationController {
  constructor(
    private readonly InformationService: InformationService
  ) {
  }

}