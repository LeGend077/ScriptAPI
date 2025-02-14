/**
 * @license MIT
 * @author JaylyMC
 * @project https://github.com/JaylyDev/GametestDB/
 */
import { Player, Location, MinecraftEntityTypes, MinecraftEffectTypes } from "@minecraft/server";
import { Commands } from "../commands/index.js";
import { clearInterval, setInterval } from "../timers/timers.js";
function trunc(x, decimal) {
    var y = Math.pow(10, decimal);
    return Math.trunc(x * y) / y;
}
;
/**
 * @remarks
 * Sets a velocity for the entity to move with.
 * Fixes GameTest native player.setVelocity
 * @param {Vector3} velocity
 * @param {Player} player
 * @throws This function can throw errors.
*/
export function setVelocity(velocity, player) {
    if (!(player instanceof Player))
        throw TypeError("Native type conversion failed.");
    var entity = player.dimension.spawnEntity(MinecraftEntityTypes.minecart.id, new Location(player.location.x, player.location.y, player.location.z));
    entity.triggerEvent('minecraft:ageable_grow_up'); // Make them adult
    entity.triggerEvent('minecraft:on_saddled'); // Add saddle to pig
    var health = entity.getComponent('health');
    var movement = entity.getComponent('movement');
    var rideable = entity.getComponent('rideable');
    entity.addEffect(MinecraftEffectTypes.invisibility, 0x7fff, 255, false); // makes the entity invisible
    entity.addEffect(MinecraftEffectTypes.resistance, 0x7fff, 255, false); // makes the entity invisible
    entity.setVelocity(velocity);
    var onInterval = setInterval(function (isEntityMoving) {
        try {
            var _a = isEntityMoving.getVelocity(), x = _a.x, y = _a.y, z = _a.z;
            if (trunc(x, 2) === 0 && trunc(y, 1) === 0 && trunc(z, 2) === 0) {
                clearInterval(onInterval); // clear timer
                rideable === null || rideable === void 0 ? void 0 : rideable.ejectRider(player); // eject rider
                // teleport entity to void to avoid mob loot drops
                var location_1 = entity.location;
                entity.teleport(new Location(location_1.x, -100, location_1.z), entity.dimension, 0, 0);
                entity.kill();
            }
            else {
                // Force the player to ride the entity until the entity lands
                Commands.runAsync("ride \"".concat(player.name, "\" start_riding @s teleport_rider"), entity);
                movement === null || movement === void 0 ? void 0 : movement.setCurrent(0);
                health === null || health === void 0 ? void 0 : health.resetToMaxValue();
            }
            ;
        }
        catch (error) {
            console.error(error);
        }
    }, 10, entity);
}
;
