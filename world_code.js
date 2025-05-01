/*
Copyright (C) 2025  MrChestplate

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation version 3.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License, see <https://www.gnu.org/licenses/agpl-3.0.en.html>.
*/

atks = {"Wood Sword":2,"Stone Sword":2,"Gold Sword":2,"Iron Sword":2,"Diamond Sword":2, "Wood Axe": 1.5, "Gold Axe": 1, "Stone Axe": 1.5, "Diamond Axe": 1.5, "Moonstone Axe": 1.5}
dma = {"Wood Sword":4,"Stone Sword":5,"Gold Sword":4,"Iron Sword":6,"Diamond Sword":7, "Wood Axe": 7, "Gold Axe": 7, "Stone Axe": 9, "Diamond Axe": 9, "Moonstone Axe": 10}
asbk = {"Wood Sword":[4,100,4],"Stone Sword":[4,100,4],"Gold Sword":[4,100,4],"Iron Sword":[4,100,4],"Diamond Sword":[4,100,4], "Wood Axe": [4,100,4], "Gold Axe": [4,100,4], "Stone Axe": [4,100,4], "Diamond Axe": [4,100,4], "Moonstone Axe":[4,100,4]}
last_pos={}
vel={}
lv={}
task = []
cent={}
function applyForwardDampingImpulse(playerId, facingAngle, velocity, damping = 0.5) {
    // Calculate the forward direction unit vector.
    // An angle of 0 corresponds to facing along +Z; x = sin(angle) and z = cos(angle).
    const forward = {
        x: Math.sin(facingAngle),
        z: Math.cos(facingAngle)
    };

    
    // Extract horizontal velocity (x and z components, ignoring vertical movement).
    const horizontalVel = { x: velocity.x, z: velocity.z };

    // Calculate the forward speed (the projection of horizontal velocity onto the forward vector).
    const forwardSpeed = horizontalVel.x * forward.x + horizontalVel.z * forward.z;

    const forwardComponent = {
    x: forward.x * forwardSpeed,
    z: forward.z * forwardSpeed
    };

    // The remaining component is sideways.
    const sidewaysComponent = {
    x: horizontalVel.x - forwardComponent.x,
    z: horizontalVel.z - forwardComponent.z
    };



    if (forwardSpeed < 0 || Math.abs(sidewaysComponent.x)>0.1 || Math.abs(sidewaysComponent.z)>0.1) {

        api.applyEffect(playerId, "Slowness", null, {inbuiltLevel:1})
        

    }else{
        api.removeEffect(playerId, "Slowness")
    }
}
function onPlayerJoin(iawd){

    
	api.sendTopRightHelper(
                iawd, 
                "info-circle", // Icon
                "Subscribe to @Javeline 947!", // Message
                {
                    duration: 10, // Seconds to show
                    width: 400, // px width
					height: 100,
                    color: "red", // Must be rgb string
                    textAndIconColor: "red"
                }
            );
    lv[iawd] = 1
    cent[iawd] = lv[iawd]
	/*api.applyEffect(iawd, "Slowness", null, {inbuiltLevel:1})*/
    asd = {customDescription: "A Shield that blocks "+lv[iawd]+" attacks!", customDisplayName: "Level "+lv[iawd]+" Moonstone Shield"}
    
    api.setItemSlot(iawd, 0, "Diamond Sword", null)
	api.setItemSlot(iawd, 1, "Moonstone Axe", null)
	api.setItemSlot(iawd, 2, "Moonstone", null, asd)
	api.setItemSlot(iawd, 3, "Cherry", 999)
    api.set\u{49}temSlot(iawd, 46, "Diamond Helmet", null);
    api.set\u{49}temSlot(iawd, 47, "Diamond Chestplate", null);
    api.set\u{49}temSlot(iawd, 48, "Diamond Gauntlets", null);
    api.set\u{49}temSlot(iawd, 49, "Diamond Leggings", null);
    api.set\u{49}temSlot(iawd, 50, "Diamond Boots", null);


	const randomIndex = Math.floor(Math.random() * possibleSpawns.length);
	const randomItem = possibleSpawns[randomIndex];
	api.setPosition(iawd, randomItem)

            
    
}
function sd([x,y,z]){
    
    api.playParticleEffect({
        dir1: [0,0,0],
        dir2: [0,0,0],
        pos1: [x, y, z],
        pos2: [x,y,z],
        texture: "bubble",
        minLifeTime: 0.1,
        maxLifeTime: 0.1,
        minEmitPower: 2,
        maxEmitPower: 2,
        minSize: 3,
        maxSize: 3,
        manualEmitCount: 1,
        gravity: [0, 0, 0],
        colorGradients: [
            {
                timeFraction: 0,
                minColor: [255, 255, 255, 1],
                maxColor: [200, 200, 200, 1],
            },
        ],
        velocityGradients: [
            {
                timeFraction: 0,
                factor: 1,
                factor2: 1,
            },
        ],
        blendMode: 1,
    })
}
function onPlayerClick(id, alt){
    slot = api.getSelectedInventorySlotI(id)
    itm = api.getItemSlot(id, slot)
   
    

    if (alt && itm && itm.attributes.customDescription && itm.attributes.customDescription.includes("A Shield that blocks")) {
        const result = api.getEffects(id).find(element => element.includes("Moonstone Shield"));
        rl = Number(itm.attributes.customDescription.match(/\d+/g))
        if (result !== "Level "+rl+" Moonstone Shield"){
            if (result && result.length>0){
                api.removeEffect(id, result)
            }
            
            api.applyEffect(id, "Level "+rl+" Moonstone Shield", null, {icon: "Moonstone"})
            api.setItemSlot(id, slot, "Moonstone", 0)
            lv[id] = rl
            cent[id] = lv[id]
        }else{
            api.sendMessage(id, "You Already Have the Same Shield Level!", {color:"red"})
        }
    }
    swa = Object.keys(atks)
    if (itm && swa.includes(itm.name)){
        api.applyEffect(id, itm.name+" Cooldown", (1/atks[itm.name])*1000, {icon: itm.name})
    }
    cent[id] = 0
}
function onPlayerSelectInventorySlot(id, aasd){
    itm = api.getItemSlot(id,aasd)
    swa = Object.keys(atks)
    if (itm && swa.includes(itm.name)){
        api.applyEffect(id, itm.name+" Cooldown", (1/atks[itm.name])*1000, {icon: itm.name})
    }
}
function onPlayerDamagingOtherPlayer(id, id1, dmg, itm){
    const result = api.getEffects(id1).find(element => element.includes("Moonstone Shield"))
    const cdd = api.getEffects(id).find(element => element.includes("Cooldown"))
    
    if (cdd && cdd.length > 0 && cdd.includes(itm+" Cooldown")){
        api.applyHealthChange(id1, dmg)
        
    }else if (!cdd && Object.keys(asbk).includes(itm)){
        if (result &&  api.isPlayerCrouching(id1)){
            if (cent[id1] > 0){
                cent[id1]-=1
            }
        }
        dirs = api.getPlayerFacingInfo(id).dir
        api.setVelocity(id1, dirs[0]*asbk[itm][0]*vel[id][0]*4,dirs[1]*asbk[itm][1]+10,dirs[2]*asbk[itm][2]*vel[id][2]*4)
        ndma = dma[itm]

        /*api.attemptApplyDamage({PlayerAttemptDamageOtherPlayerOpts:{eid:id1,hitEId:id,attemptedDmgAmt:ndma,withItem:itm,bodyPartHit:undefined,attackDir:dirs,showCritParticles:false,reduceVerticalKbVelocity:false,broadcastEntityHurt:false,attackCooldownSettings:null,hittingSoundOverride:null,ignoreOtherEntitySettingCanAttack:false,isTrueDamage:false,damagerDbId:null}})*/
        api.applyHealthChange(id1, -ndma, id)
        recordDamage(id, id1, dmg+dma[itm])
    }
}
function tick(){
    
    api.getPlayerIds().forEach(id => {
        n=api.getPosition(id)
        if(last_pos[id]){
        
            lp = last_pos[id]
            v = [lp[0]-n[0],lp[1]-n[1],lp[2]-n[2]]
            last_pos[id]=api.getPosition(id)
            pfp = api.getPlayerFacingInfo(id).angleDir.theta
            /*api.broadcastMessage([v[0]/pfp[0],v[1]/pfp[1],v[2]/pfp[2]].toString())}*/
            const facingAngle = pfp // 45-degrees in radians.
            const currentVelocity = { x: v[0], y: v[1], z: v[2] };

            // A damping factor of 0.5 means we want to remove half of the non-forward movement.
            applyForwardDampingImpulse(id, facingAngle, currentVelocity,5);
            vel[id] = v
        }else{
            last_pos[id]=api.getPosition(id)
            

        }
        
        const result = api.getEffects(id).find(element => element.includes("Moonstone Shield"));
        if (result){
            rl = Number(result.match(/\d+/g))
            if (result && result.length > 0 && api.isPlayerCrouching(id) && cent[id] > 0 && !api.getEffects(id).includes("Moonstone Shield Cooldown")){
                sd(api.getPlayerFacingInfo(id).camPos)
                api.applyEffect(id, "Damage Reduction", null, {inbuiltLevel: 1e9})
            }else{
                api.removeEffect(id, "Damage Reduction")
                
            }
            if (cent[id] < rl){
                api.applyEffect(id, "Moonstone Shield Cooldown", 1000, {icon: "Moonstone Fragment"})
            }
            if (rl && !api.isPlayerCrouching(id) && cent[id] < rl && api.getEffects(id).includes("Moonstone Shield Cooldown")){
                api.removeEffect(id, "Moonstone Shield Cooldown")
                cent[id] = lv[id]
            }
        }

    });
}
