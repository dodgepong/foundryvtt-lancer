import { Mech } from "machine-mind";
import type { LancerActor } from "../actor/lancer-actor";
// import { HANDLER_activate_general_controls } from "../helpers/commons";
// import {
//   HANDLER_activate_native_ref_dragging,
//   HANDLER_activate_ref_dragging,
//   HANDLER_activate_ref_clicking,
// } from "../helpers/refs";
// import { HANDLER_activate_item_context_menus } from "../helpers/item";
import { prepareTextMacro } from "../macros/text";

interface DestroyedWeapon {
    label: string;
    id: string;
}

interface DestroyedSystem {
    label: string;
    id: string;
}

export interface RestDialogData {
  content: string;
  buttons: Record<string, Dialog.Button>;
  currentRepairs: number,
  repairCap: number,
  isDestroyed: Boolean;
  currentHP: number,
  maxHP: number,
  destroyedWeapons: DestroyedWeapon[],
  destroyedSystems: DestroyedSystem[],
  currentStructure: number,
  maxStructure: number,
  currentStress: number,
  maxStress: number
}

/**
 * A helper Dialog subclass for performing a short rest
 * @extends {Dialog}
 */
export class RestDialog extends Dialog {
  constructor(readonly actor: LancerActor, dialogData: Dialog.Data, options: Partial<Dialog.Options> = {}) {
    super(dialogData, options);
    this.actor = actor;
  }

  /* -------------------------------------------- */

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: `systems/${game.system.id}/templates/window/promptRest.hbs`,
      width: 600,
      height: "auto",
      classes: ["lancer"],
    });
  }

  /** @override
   * Expose our data.
   */
  // @ts-ignore Dialog is apparently cut off from async in league types
  async getData(): Promise<RestDialogData> {
    let mm = await this.actor.data.data.derived.mm_promise;
    if (mm instanceof Mech) {
      let destroyedWeapons: DestroyedWeapon[] = mm.Loadout.WepMounts.filter(mount => {
        return mount.Weapons.filter(weapon => weapon.Destroyed).length > 0;
      }).map(mount => {
        return mount.Weapons.map(weapon => {
            return { label: `${weapon.Name} // ${mount.MountType.toUpperCase()} ${weapon.SelectedProfile.WepType.toUpperCase()}`, id: weapon.RegistryID }
        });
      }).flat();

      let destroyedSystems: DestroyedSystem[] = mm.Loadout.Systems.filter(system => system.Destroyed).map(system => {
        return { label: system.Name, id: system.RegistryID }
      });

      console.log(super.getData());

      return {
        ...super.getData(),
        currentRepairs: mm.CurrentRepairs,
        repairCap: mm.RepairCapacity,
        isDestroyed: mm.Destroyed,
        currentHP: mm.CurrentHP,
        maxHP: mm.MaxHP,
        destroyedWeapons: destroyedWeapons,
        destroyedSystems: destroyedSystems,
        currentStructure: mm.CurrentStructure,
        maxStructure: mm.MaxStructure,
        currentStress: mm.CurrentStress,
        maxStress: mm.MaxStress
      };
    } else {
      return Promise.reject();
    }
  }

  /** @inheritdoc */
  render(force: any, options = {}) {
    // Register the active Application with the referenced Documents, to get updates
    this.actor.apps[this.appId] = this;
    return super.render(force, options);
  }

  async close(options: FormApplication.CloseOptions = {}) {
    delete this.actor.apps[this.appId];
    return super.close(options);
  }

  /**
   * @override
   * Activate event listeners using the prepared sheet HTML
   * @param html {HTMLElement}   The prepared HTML object ready to be rendered into the DOM
   */
  activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);


  }
}
