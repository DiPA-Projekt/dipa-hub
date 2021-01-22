import { Template } from "dipa-api-client";

export interface TemplateItems {
    current: Template;
    standard: Template[];
    others?: Template[];
}
