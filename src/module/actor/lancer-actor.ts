
import { LancerPilotActorData, LancerNPCActorData, LancerDeployableActorData, LancerFrameStatsData, LancerNPCClassStatsData } from '../interfaces'

/**
 * Extend the Actor class for Lancer Actors.
 */
export class LancerActor extends Actor {
  data: LancerPilotActorData | LancerNPCActorData | LancerDeployableActorData;

  // This gets called every time client is refreshed. No good. Go back to _onCreate
  _onCreate(data: any, options: object, userId: string) {
    console.log(`LANCER | actor._onCreate by ${userId}`);
    console.log(data);
    console.log(options);
    if (data.type === "pilot") {
      console.log("LANCER | pilot._onCreate");
      const mech = {
        name: "",
        size: 1,
        hull: 0,
        agility: 0,
        systems: 0,
        engingeering: 0,
        hp: {min: 0, max: 0, value: 0},
        structure: {min: 0, max: 4, value: 4},
        heat: {min: 0, max: 0, value: 0},
        stress: {min: 0, max: 4, value: 4},
        repairs: {min: 0, max: 0, value: 0},
        armor: 0,
        speed: 0,
        evasion: 0,
        edef: 0,
        sensors: 0,
        save: 0,
      };

      if (!data.data) {
        data.data = {
          mech: mech,
        };
      }
      else {
        data.data.mech = mech;
      }
    }
    super._onCreate(data, options, userId, {});
  }

  /**
   * Change mech frames for a pilot. Recalculates all mech-related stats on the pilot.
   * @param newFrame Stats object from the new mech frame.
   * @param oldFrame Stats object from the old mech frame, optional.
   */
  swapFrames(newFrame: LancerFrameStatsData, oldFrame?: LancerFrameStatsData): Promise<LancerActor> {
    // Function is only applicable to pilots.
    if (this.data.type !== "pilot") return;

    const data = duplicate(this.data) as LancerPilotActorData;
    const mech = duplicate((this.data as LancerPilotActorData).data.mech);

    if (!oldFrame) {
      oldFrame = {
        size: 0,
        armor: 0,
        hp: 0,
        evasion: 0,
        edef: 0,
        heatcap: 0,
        repcap: 0,
        sensor_range: 0,
        tech_attack: 0,
        save: 0,
        speed: 0,
        sp: 0,
      }
    }
        // Resources
        mech.hp.max = mech.hp.max - oldFrame.hp + newFrame.hp;
        mech.hp.value = Math.min(mech.hp.value, mech.hp.max);
        mech.heat.max = mech.heat.max - oldFrame.heatcap + newFrame.heatcap;
        mech.heat.value = Math.min(mech.heat.value, mech.heat.max);
        mech.repairs.max = mech.repairs.max - oldFrame.repcap + newFrame.repcap;
        mech.repairs.value = Math.min(mech.repairs.value, mech.repairs.max);
    
        // Stats
        mech.size = mech.size - oldFrame.size + newFrame.size;
        mech.armor = Math.max(mech.armor - oldFrame.armor + newFrame.armor, 0);
        mech.speed = mech.speed - oldFrame.speed + newFrame.speed;
        mech.evasion = mech.evasion - oldFrame.evasion + newFrame.evasion;
        mech.edef = mech.edef - oldFrame.edef + newFrame.edef;
        mech.sensors = mech.sensors - oldFrame.sensor_range + newFrame.sensor_range;
        mech.save = mech.save - oldFrame.save + newFrame.save;
    
        // Update the actor
        data.data.mech = mech;
        return (this.update(data) as Promise<LancerActor>);
  }

    /**
   * Change Class for a NPC. Recalculates all stats on the NPC.
   * @param newNPCClass Stats object from the new Class.
   * @param oldNPCClass Stats object from the old Class, optional.
   */
  swapNPCClass(newNPCClass: LancerNPCClassStatsData, oldNPCClass?: LancerNPCClassStatsData): Promise<LancerActor> {
    
    // Function is only applicable to NPCs.
    if (this.data.type !== "npc") return;

    const data = duplicate(this.data) as LancerNPCActorData;
    const mech = duplicate((this.data as LancerNPCActorData).data.mech);

    if (!oldNPCClass) {
      oldNPCClass = {
        hull: [0,0,0],
        agility: [0,0,0],
        systems: [0,0,0],
        engineering: [0,0,0],
        structure: [0,0,0],
        armor: [0,0,0],
        hp: [0,0,0],
        stress:[0,0,0],
        heatcap: [0,0,0],
        speed: [0,0,0],
        save: [0,0,0],
        evasion: [0,0,0],
        edef: [0,0,0],
        sensor_range: [0,0,0],
        activations: [0,0,0],
        size: [0,0,0],
      }
    }
    //HASE
    mech.hull = Math.max(mech.hull - oldNPCClass.hull[0] + newNPCClass.hull[0], 0);
    mech.agility = Math.max(mech.agility - oldNPCClass.agility[0] + newNPCClass.agility[0], 0);
    mech.systems = Math.max(mech.systems - oldNPCClass.systems[0] + newNPCClass.systems[0], 0);
    mech.engineering = Math.max(mech.engineering - oldNPCClass.engineering[0] + newNPCClass.engineering[0], 0);

    // Resources
    mech.stress.max = mech.stress.max - oldNPCClass.stress[0] + newNPCClass.stress[0];
    mech.stress.value = Math.min(mech.stress.value, mech.stress.max);
    mech.structure.max = mech.structure.max - oldNPCClass.structure[0] + newNPCClass.structure[0];
    mech.structure.value = Math.min(mech.structure.value, mech.structure.max);
    mech.hp.max = mech.hp.max - oldNPCClass.hp[0] + newNPCClass.hp[0];
    mech.hp.value = Math.min(mech.hp.value, mech.hp.max);
    mech.heat.max = mech.heat.max - oldNPCClass.heatcap[0] + newNPCClass.heatcap[0];
    mech.heat.value = Math.min(mech.heat.value, mech.heat.max);

    // Stats
    mech.size = mech.size - oldNPCClass.size[0] + newNPCClass.size[0];
    mech.armor = Math.max(mech.armor - oldNPCClass.armor[0] + newNPCClass.armor[0], 0);
    mech.speed = mech.speed - oldNPCClass.speed[0] + newNPCClass.speed[0];
    mech.evasion = mech.evasion - oldNPCClass.evasion[0] + newNPCClass.evasion[0];
    mech.edef = mech.edef - oldNPCClass.edef[0] + newNPCClass.edef[0];
    mech.sensors = mech.sensors - oldNPCClass.sensor_range[0] + newNPCClass.sensor_range[0];
    mech.save = mech.save - oldNPCClass.save[0] + newNPCClass.save[0];
    data.data.activations = data.data.activations - oldNPCClass.activations[0] + newNPCClass.activations[0];

    // Update the actor
    data.data.mech = mech;
    return (this.update(data) as Promise<LancerActor>);
  }
 }
