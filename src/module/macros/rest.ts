// Import TypeScript modules
import { LANCER } from "../config";
import { is_reg_mech } from "../actor/lancer-actor";
import { getMacroSpeaker } from "./_util";
import { prepareTextMacro } from "./text";
import { RestDialog } from "../apps/rest";
import { MechWeapon } from "machine-mind";

const lp = LANCER.log_prefix;

export async function restMacro(a: string) {
  // Determine which Actor to speak as
  let actor = getMacroSpeaker(a);
  if (!actor) return Promise.reject();

  let ent = await actor.data.data.derived.mm_promise;
  if (!(is_reg_mech(ent))) {
    ui.notifications!.warn("This can't rest!");
    return "";
  }

  return new Promise<boolean>((resolve, reject) => {
    if (!actor) return reject();
    new RestDialog(actor, {
      title: `REST - ${actor?.name}`,
      content: "",
      buttons: {
        submit: {
          icon: '<i class="fas fa-check"></i>',
          label: "Submit",
          callback: async dlg => {
            // Gotta typeguard the actor again
            if (!actor) return reject();

            // let o1 = <StabOptions1>$(dlg).find(".stabilize-options-1:checked").first().val();
            // let o2 = <StabOptions2>$(dlg).find(".stabilize-options-2:checked").first().val();

            let text = await actor.rest(0, true, [], [], 0, 0);

            if (!text) return;

            prepareTextMacro(
              a,
              `${actor.name?.capitalize()} HAS RESTED`,
              `${actor.name} has rested.<br>${text}`
            );
            return resolve(true);
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: async () => resolve(false),
        }
      },
      default: "submit",
      close: () => resolve(false),
    }).render(true);
  });
}
