import * as mm from "./metabolic_model"
import * as $ from "jquery";
import * as reactions from "./page_reactions"
import * as metabolites from "./page_metabolites"
import * as stoichiometry from "./page_stoichiometry"
import * as settings from "./page_settings"
import * as simulation from "./page_simulation"
import * as dialog_reaction from "./dialog_reaction"
import * as dialog_reaction_bulkadd from "./dialog_reaction_bulkadd"
import * as dialog_reaction_delete from "./dialog_reaction_delete"
import * as dialog_metabolite from "./dialog_metabolite"
import { RequestHandler } from "./request_handler"

declare var app : AppManager;

export class AppManager {
    readonly dialog_reaction: dialog_reaction.Dialog;
    readonly dialog_reaction_bulk: dialog_reaction_bulkadd.Dialog;
    readonly dialog_reaction_delete: dialog_reaction_delete.Dialog;
    readonly dialog_metabolite: dialog_metabolite.Dialog;
    readonly reaction_page: reactions.Page;
    readonly metabolite_page: metabolites.Page;
    readonly stoichiometry_page: stoichiometry.Page;
    readonly settings_page: settings.Page;
    readonly simulation_page: simulation.Page;
    readonly model: mm.Model;
    readonly command_list: any = [];
    readonly urls: any;
    readonly request_handler: RequestHandler;

    constructor(model: mm.Model, urls: any) {
        this.model = model;
        this.urls = urls;
        this.request_handler = new RequestHandler(this, -1);

        this.dialog_reaction = new dialog_reaction.Dialog(this);
        this.dialog_reaction_bulk = new dialog_reaction_bulkadd.Dialog(this);
        this.dialog_reaction_delete = new dialog_reaction_delete.Dialog(this);
        this.dialog_metabolite = new dialog_metabolite.Dialog(this);

        this.reaction_page = new reactions.Page(document.getElementById("reaction-tab")!, this);
        this.metabolite_page = new metabolites.Page(document.getElementById("metabolite-tab")!, this);
        this.stoichiometry_page = new stoichiometry.Page(document.getElementById("chemical-tab")!, this);
        this.settings_page = new settings.Page(document.getElementById("settings-tab")!, this);
        this.simulation_page = new simulation.Page(document.getElementById("simulation-tab")!, this);
    }
}

export function run(mm_cls: any, urls: any) {
    $.ajax({
        url: urls.get_reactions,
        context: document.body
    }).done(function(x) {
        let model = new mm_cls.Model();
        model.fromJson(x);

        app = new AppManager(model, urls);

        app.reaction_page.init();
        app.metabolite_page.init();
        app.stoichiometry_page.init();
        app.settings_page.init();
        app.simulation_page.init();

        $(".create-enzyme-button").on("click", function () {
            app.dialog_reaction.show(null);
        });

        $(".create-metabolite-button").on("click", function () {
            app.dialog_metabolite.show(null);
        });

        $(".create-enzyme-bulk-button").on("click", function () {
            app.dialog_reaction_bulk.show();
        });

        app.request_handler.endRequest($("#content"));
    });
}
