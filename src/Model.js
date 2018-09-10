class Model {
    static get model() {
        return {
            "solarPanels": {
                "title": "Solar Panels",
                "type": "stationModules",
                "cost": 100,
                "effect": 1,
                "description": "Generates a static amount of credits each second",
                "effectTemplate": "+{EFFECT} $/s",
                "requirements": []
            }
            ,
            "scienceLab": {
                "title": "Science Lab",
                "type": "stationModules",
                "cost": 1100,
                "effect": 8,
                "description": "Generates a static amount of credits each second",
                "effectTemplate": "+{EFFECT} $/s",
                "requirements": [
                    {
                        "name": "solarPanels",
                        "level": 1
                    }
                ]
            }
            ,
            "factory": {
                "title": "Factory",
                "type": "stationModules",
                "cost": 12000,
                "effect": 47,
                "description": "Generates a static amount of credits each second",
                "effectTemplate": "+{EFFECT} $/s",
                "requirements": [
                    {
                        "name": "scienceLab",
                        "level": 1
                    }
                ]
            }
            ,
            "crewQuarters": {
                "title": "Crew Quarters",
                "type": "stationModules",
                "cost": 130000,
                "effect": 253,
                "description": "Generates a static amount of credits each second",
                "effectTemplate": "+{EFFECT} $/s",
                "requirements": [
                    {
                        "name": "factory",
                        "level": 1
                    }
                ]
            }
            ,
            "waterTreatmentPlant": {
                "title": "Water Treatment Plant",
                "type": "stationModules",
                "cost": 1400000,
                "effect": 1327,
                "description": "Generates a static amount of credits each second",
                "effectTemplate": "+{EFFECT} $/s",
                "requirements": [
                    {
                        "name": "crewQuarters",
                        "level": 1
                    }
                ]
            }
            ,
            "teleporter": {
                "title": "Teleporter",
                "type": "stationModules",
                "cost": 15000000,
                "effect": 10416,
                "description": "Generates a static amount of credits each second",
                "effectTemplate": "+{EFFECT} $/s",
                "requirements": [
                    {
                        "name": "waterTreatmentPlant",
                        "level": 1
                    }
                ]
            }
            ,
            "droneBay": {
                "title": "Drone Bay",
                "type": "stationModules",
                "cost": 160000000,
                "effect": 80808,
                "description": "Generates a static amount of credits each second",
                "effectTemplate": "+{EFFECT} $/s",
                "requirements": [
                    {
                        "name": "teleporter",
                        "level": 1
                    }
                ]
            }
            ,
            "hangar": {
                "title": "Hangar",
                "type": "stationModules",
                "cost": 1700000000,
                "effect": 630630,
                "description": "Generates a static amount of credits each second",
                "effectTemplate": "+{EFFECT} $/s",
                "requirements": [
                    {
                        "name": "droneBay",
                        "level": 1
                    }
                ]
            }
            ,
            "antimatterSiphon": {
                "title": "Antimatter Siphon",
                "type": "stationModules",
                "cost": 18000000000,
                "effect": 4987284,
                "description": "Generates a static amount of credits each second",
                "effectTemplate": "+{EFFECT} $/s",
                "requirements": [
                    {
                        "name": "hangar",
                        "level": 1
                    }
                ]
            }
            ,
            "warpDrive": {
                "title": "Warp Drive",
                "type": "stationModules",
                "cost": 190000000000,
                "effect": 42424242,
                "description": "Generates a static amount of credits each second",
                "effectTemplate": "+{EFFECT} $/s",
                "requirements": [
                    {
                        "name": "antimatterSiphon",
                        "level": 1
                    }
                ]
            }
            ,
            "projectileDamage": {
                "title": "Projectile Damage",
                "type": "shipUpgrades",
                "cost": 50,
                "description": "Increases the projectile damage",
                "effectTemplate": "{EFFECT}x multiplier",
                "requirements": [
                    {
                        "name": "factory",
                        "level": 1
                    }
                ]
            }
            ,
            "clusterAmmunition": {
                "title": "Cluster Ammunition",
                "type": "shipUpgrades",
                "cost": 500000,
                "description": "Increases the projectile damage",
                "effectTemplate": "{EFFECT}x multiplier",
                "requirements": [
                    {
                        "name": "projectileDamage",
                        "level": 1
                    }
                ]
            }
            ,
            "criticalHitChance": {
                "title": "Critical Hit Chance",
                "type": "shipUpgrades",
                "cost": 10000,
                "description": "Chance to perform a critical hit",
                "effectTemplate": "{EFFECT}% chance",
                "cap": 400,
                "requirements": [
                    {
                        "name": "clusterAmmunition",
                        "level": 1
                    }
                ]
            }
            ,
            "criticalHitDamage": {
                "title": "Critical Hit Damage",
                "type": "shipUpgrades",
                "cost": 10000,
                "description": "Increases the damage dealt when performing a critical hit",
                "effectTemplate": "{EFFECT}x multiplier",
                "requirements": [
                    {
                        "name": "criticalHitChance",
                        "level": 1
                    }
                ]
            }
            ,
            "freezeChance": {
                "title": "Freeze Chance",
                "type": "shipUpgrades",
                "cost": 100000,
                "description": "Chance that the enemy is frozen, which reduces his movement speed by 2% per hit. Stacks multiplicative",
                "effectTemplate": "{EFFECT}% chance",
                "cap": 400,
                "requirements": [
                    {
                        "name": "clusterAmmunition",
                        "level": 1
                    }
                ]
            }
            ,
            "burnChance": {
                "title": "Burn Chance",
                "type": "shipUpgrades",
                "cost": 500000,
                "description": "Chance that the enemy catches fire upon impact, dealing 1% of [Projectile Damage] each tick. Stacks additive",
                "effectTemplate": "{EFFECT}% chance",
                "cap": 400,
                "requirements": [
                    {
                        "name": "clusterAmmunition",
                        "level": 1
                    }
                ]
            }
            ,
            "rateOfFire": {
                "title": "Rate of Fire",
                "type": "shipUpgrades",
                "cost": 50,
                "description": "Increases the projectile fire rate",
                "effectTemplate": "{EFFECT} shots/60ticks",
                "requirements": [
                    {
                        "name": "factory",
                        "level": 1
                    }
                ]
            }
            ,
            "projectileAmount": {
                "title": "Projectile Amount",
                "type": "shipUpgrades",
                "cost": 5000,
                "description": "Increases the amount of projectiles to up to 5. Subsequent levels instead increase the projectile damage further",
                "effectTemplate": "{EFFECT}x multiplier",
                "requirements": [
                    {
                        "name": "rateOfFire",
                        "level": 1
                    }
                ]
            }
            ,
            "projectileSpread": {
                "title": "Projectile Spread",
                "type": "shipUpgrades",
                "cost": 5000,
                "description": "Increases the spread in case more than 1 projectile is fired at once",
                "effectTemplate": "{EFFECT}x multiplier",
                "requirements": [
                    {
                        "name": "projectileAmount",
                        "level": 1
                    }
                ]
            }
            ,
            "projectilePierceChance": {
                "title": "Projectile Pierce Chance",
                "type": "shipUpgrades",
                "cost": 25000,
                "description": "Chance that the projectile is not consumed upon impact. Can not hit the same enemy multiple times",
                "effectTemplate": "{EFFECT}% chance",
                "cap": 400,
                "requirements": [
                    {
                        "name": "projectileAmount",
                        "level": 1
                    }
                ]
            }
            ,
            "projectileForkChance": {
                "title": "Projectile Fork Chance",
                "type": "shipUpgrades",
                "cost": 25000,
                "description": "Chance that the projectile is split into 3 upon impact. Can not hit the same enemy multiple times",
                "effectTemplate": "{EFFECT}% chance",
                "cap": 400,
                "requirements": [
                    {
                        "name": "projectilePierceChance",
                        "level": 1
                    }
                ]
            }
            ,
            "maxShield": {
                "title": "Shield Amount",
                "type": "shipUpgrades",
                "cost": 50000,
                "description": "Increases the Maximum Shield",
                "effectTemplate": "{EFFECT}x multiplier",
                "requirements": [
                    {
                        "name": "factory",
                        "level": 1
                    }
                ]
            }
            ,
            "plasmaField": {
                "title": "Plasma Field",
                "type": "shipUpgrades",
                "cost": 1000000000,
                "description": "Increases the Maximum Shield",
                "effectTemplate": "{EFFECT}x multiplier",
                "requirements": [
                    {
                        "name": "maxShield",
                        "level": 1
                    }
                ]
            }
            ,
            "overshieldChance": {
                "title": "Overshield Chance",
                "type": "shipUpgrades",
                "cost": 100000,
                "description": "Chance that a hit is fully absorbed by the shield without affecting armor . Requires full shield to trigger and will deplete the whole shield bar",
                "effectTemplate": "{EFFECT}% chance",
                "cap": 400,
                "requirements": [
                    {
                        "name": "plasmaField",
                        "level": 1
                    }
                ]
            }
            ,
            "shieldRechargeTime": {
                "title": "Shield Recharge",
                "type": "shipUpgrades",
                "cost": 25,
                "description": "Decreases the Shield Recharge Time (<i>Aka increases the shield regeneration per frame</i>)",
                "effectTemplate": "{EFFECT}x multiplier",
                "requirements": [
                    {
                        "name": "maxShield",
                        "level": 1
                    }
                ]
            }
            ,
            "shieldRechargeAccelerator": {
                "title": "Shield Recharge Accelerator",
                "type": "shipUpgrades",
                "cost": 5000,
                "description": "When not being hit for 300 frames, decreases the Shield Recharge Time substantially (<i>Aka increases the shield regeneration per frame</i>)",
                "effectTemplate": "{EFFECT}x multiplier",
                "requirements": [
                    {
                        "name": "shieldRechargeTime",
                        "level": 1
                    }
                ]
            }
            ,
            "maxArmor": {
                "title": "Armor Amount",
                "type": "shipUpgrades",
                "cost": 50000,
                "description": "Increases the Maximum Armor",
                "effectTemplate": "{EFFECT}x multiplier",
                "requirements": [
                    {
                        "name": "factory",
                        "level": 1
                    }
                ]
            }
            ,
            "titaniumAlloy": {
                "title": "Titanium Alloy",
                "type": "shipUpgrades",
                "cost": 1000000000,
                "description": "Increases the Maximum Armor",
                "effectTemplate": "{EFFECT}x multiplier",
                "requirements": [
                    {
                        "name": "maxArmor",
                        "level": 1
                    }
                ]
            }
            ,
            "armorPlating": {
                "title": "Armor Plating",
                "type": "shipUpgrades",
                "cost": 100000,
                "description": "Reduces armor  damage taken by an absolute value",
                "effectTemplate": "{EFFECT} abs. reduction",
                "requirements": [
                    {
                        "name": "maxArmor",
                        "level": 1
                    }
                ]
            }
            ,
            "repulsorField": {
                "title": "Repulsor Field",
                "type": "shipUpgrades",
                "cost": 50000000000,
                "description": "Reduces all incoming damage by a relative amount",
                "effectTemplate": "{EFFECT}x multiplier",
                "cap": 520,
                "requirements": [
                    {
                        "name": "factory",
                        "level": 1
                    }
                ]
            }
            ,
            "movementSpeed": {
                "title": "Movement Speed",
                "type": "shipUpgrades",
                "cost": 10,
                "description": "Increases the Movement Speed",
                "effectTemplate": "{EFFECT} pixel/tick",
                "requirements": [
                    {
                        "name": "factory",
                        "level": 1
                    }
                ]
            }
            ,
            "salvager": {
                "title": "Salvager",
                "type": "shipUpgrades",
                "cost": 50000000000,
                "description": "Increases the credits gained for killing enemies by salvaging the wreckage",
                "effectTemplate": "{EFFECT}x multiplier",
                "requirements": [
                    {
                        "name": "movementSpeed",
                        "level": 1
                    }
                ]
            }
        }
    }
}