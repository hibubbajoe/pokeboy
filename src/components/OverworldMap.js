// import GameObject from "./GameObject";
import { nextPosition, withGrid, asGridCoord } from "../utils/utils";
import Person from "./Person";
import OverworldEvent from "./OverworldEvent";

export default class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc || "";

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      withGrid(10.5) - cameraPerson.x,
      withGrid(6) - cameraPerson.y
    );
  }
  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      withGrid(10.5) - cameraPerson.x,
      withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currX, currY, direction) {
    const { x, y } = nextPosition(currX, currY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects = () => {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;
      object.mount(this);
    });
  };

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach((object) =>
      object.doBehaviorEvent(this)
    );
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    console.log(match);

    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

window.OverworldMaps = {
  Town: {
    lowerSrc: "/images/maps/PokemonLower.png",
    upperSrc: "/images/maps/PokemonUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: withGrid(6),
        y: withGrid(8),
      }),
      // Försök få pikachu att hela tiden ligga ett steg bakom ash
      npc1: new Person({
        x: withGrid(11),
        y: withGrid(7),
        src: "/images/characters/people/pikachu.png",
        behaviorLoop: [
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time: 1500 },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "stand", direction: "down", time: 1700 },
        ],
      }),
      npc2: new Person({
        x: withGrid(15),
        y: withGrid(8),
        src: "/images/characters/people/bulbasaur.png",
        behaviorLoop: [{ type: "stand", direction: "down", time: 800 }],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "You can't come in here..",
                faceHero: "npc2",
              },
            ],
          },
        ],
      }),
      npc3: new Person({
        x: withGrid(6),
        y: withGrid(18),
        src: "/images/characters/people/kingsler.png",
        behaviorLoop: [
          { type: "stand", direction: "right", time: 10000 },
          { type: "stand", direction: "up", time: 800 },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "I kinda wanna go swim man!",
                faceHero: "npc3",
              },
            ],
          },
        ],
      }),
      npc4: new Person({
        x: withGrid(14),
        y: withGrid(2),
        src: "/images/characters/people/gengar.png",
        behaviorLoop: [
          { type: "stand", direction: "down", time: 10000 },
          { type: "stand", direction: "up", time: 800 },
        ],
        talking: [
          {
            events: [{ type: "textMessage", text: "BOO!!", faceHero: "npc3" }],
          },
        ],
      }),
    },
    walls: {
      // map western wall
      [asGridCoord(1, 1)]: true,
      [asGridCoord(1, 2)]: true,
      [asGridCoord(1, 3)]: true,
      [asGridCoord(1, 4)]: true,
      [asGridCoord(1, 5)]: true,
      [asGridCoord(1, 6)]: true,
      [asGridCoord(1, 7)]: true,
      [asGridCoord(1, 8)]: true,
      [asGridCoord(1, 9)]: true,
      [asGridCoord(1, 10)]: true,
      [asGridCoord(1, 11)]: true,
      [asGridCoord(1, 12)]: true,
      [asGridCoord(1, 13)]: true,
      [asGridCoord(1, 14)]: true,
      [asGridCoord(1, 15)]: true,
      [asGridCoord(1, 16)]: true,
      [asGridCoord(1, 17)]: true,
      [asGridCoord(1, 18)]: true,

      // map eastern wall
      [asGridCoord(22, 1)]: true,
      [asGridCoord(22, 2)]: true,
      [asGridCoord(22, 3)]: true,
      [asGridCoord(22, 4)]: true,
      [asGridCoord(22, 5)]: true,
      [asGridCoord(22, 6)]: true,
      [asGridCoord(22, 7)]: true,
      [asGridCoord(22, 8)]: true,
      [asGridCoord(22, 9)]: true,
      [asGridCoord(22, 10)]: true,
      [asGridCoord(22, 11)]: true,
      [asGridCoord(22, 12)]: true,
      [asGridCoord(22, 13)]: true,
      [asGridCoord(22, 14)]: true,
      [asGridCoord(22, 15)]: true,
      [asGridCoord(22, 16)]: true,
      [asGridCoord(22, 17)]: true,
      [asGridCoord(22, 18)]: true,

      // map northern wall
      [asGridCoord(2, 1)]: true,
      [asGridCoord(3, 1)]: true,
      [asGridCoord(4, 1)]: true,
      [asGridCoord(5, 1)]: true,
      [asGridCoord(6, 1)]: true,
      [asGridCoord(7, 1)]: true,
      [asGridCoord(8, 1)]: true,
      [asGridCoord(9, 1)]: true,
      [asGridCoord(10, 1)]: true,
      [asGridCoord(11, 1)]: true,
      [asGridCoord(12, 0)]: true,
      [asGridCoord(13, 0)]: true,
      [asGridCoord(14, 1)]: true,
      [asGridCoord(15, 1)]: true,
      [asGridCoord(16, 1)]: true,
      [asGridCoord(17, 1)]: true,
      [asGridCoord(18, 1)]: true,
      [asGridCoord(19, 1)]: true,
      [asGridCoord(20, 1)]: true,
      [asGridCoord(21, 1)]: true,

      // map southern wall
      [asGridCoord(2, 19)]: true,
      [asGridCoord(3, 19)]: true,
      [asGridCoord(4, 19)]: true,
      [asGridCoord(5, 19)]: true,
      // no trees
      [asGridCoord(6, 20)]: true,
      // water starts
      [asGridCoord(7, 19)]: true,
      [asGridCoord(7, 18)]: true,
      [asGridCoord(7, 17)]: true,
      [asGridCoord(8, 17)]: true,
      [asGridCoord(9, 17)]: true,
      [asGridCoord(10, 17)]: true,
      [asGridCoord(10, 18)]: true,
      [asGridCoord(10, 19)]: true,
      // no trees continues
      [asGridCoord(11, 20)]: true,
      [asGridCoord(12, 20)]: true,
      [asGridCoord(13, 20)]: true,
      [asGridCoord(14, 20)]: true,
      [asGridCoord(15, 20)]: true,
      [asGridCoord(16, 20)]: true,
      [asGridCoord(17, 20)]: true,
      // trees come back
      [asGridCoord(18, 19)]: true,
      [asGridCoord(19, 19)]: true,
      [asGridCoord(20, 19)]: true,
      [asGridCoord(21, 19)]: true,

      // fences
      [asGridCoord(13, 16)]: true,
      [asGridCoord(14, 16)]: true,
      [asGridCoord(15, 16)]: true,
      [asGridCoord(16, 16)]: true,
      [asGridCoord(17, 16)]: true,
      [asGridCoord(18, 16)]: true,
      [asGridCoord(5, 11)]: true,
      [asGridCoord(6, 11)]: true,
      [asGridCoord(7, 11)]: true,
      [asGridCoord(8, 11)]: true,
      [asGridCoord(9, 11)]: true,
      [asGridCoord(5, 14)]: true,

      // left house
      [asGridCoord(4, 7)]: true,
      [asGridCoord(5, 7)]: true,
      [asGridCoord(6, 6)]: true,
      [asGridCoord(6, 7)]: true,
      [asGridCoord(7, 7)]: true,
      [asGridCoord(8, 7)]: true,
      [asGridCoord(9, 7)]: true,
      [asGridCoord(9, 6)]: true,
      [asGridCoord(9, 5)]: true,
      [asGridCoord(9, 4)]: true,
      [asGridCoord(9, 4)]: true,
      [asGridCoord(8, 4)]: true,
      [asGridCoord(7, 4)]: true,
      [asGridCoord(6, 4)]: true,
      [asGridCoord(5, 4)]: true,
      [asGridCoord(5, 5)]: true,
      [asGridCoord(5, 6)]: true,

      // right house
      [asGridCoord(13, 7)]: true,
      [asGridCoord(14, 7)]: true,
      [asGridCoord(15, 6)]: true,
      [asGridCoord(16, 7)]: true,
      [asGridCoord(17, 7)]: true,
      [asGridCoord(18, 7)]: true,
      [asGridCoord(18, 6)]: true,
      [asGridCoord(18, 5)]: true,
      [asGridCoord(18, 4)]: true,
      [asGridCoord(18, 4)]: true,
      [asGridCoord(17, 4)]: true,
      [asGridCoord(16, 4)]: true,
      [asGridCoord(15, 4)]: true,
      [asGridCoord(14, 4)]: true,
      [asGridCoord(14, 5)]: true,
      [asGridCoord(14, 6)]: true,

      // big house
      [asGridCoord(13, 10)]: true,
      [asGridCoord(14, 10)]: true,
      [asGridCoord(15, 10)]: true,
      [asGridCoord(16, 10)]: true,
      [asGridCoord(17, 10)]: true,
      [asGridCoord(18, 10)]: true,
      [asGridCoord(19, 10)]: true,
      [asGridCoord(19, 11)]: true,
      [asGridCoord(19, 12)]: true,
      [asGridCoord(19, 13)]: true,
      [asGridCoord(18, 13)]: true,
      [asGridCoord(17, 13)]: true,
      [asGridCoord(16, 13)]: true,
      [asGridCoord(15, 13)]: true,
      [asGridCoord(14, 13)]: true,
      [asGridCoord(13, 13)]: true,
      [asGridCoord(13, 12)]: true,
      [asGridCoord(13, 11)]: true,
    },
    cutsceneSpaces: {
      // [asGridCoord(6, 7)]: [
      //     {
      //         events: [
      //             { type: "changeMap", map: "House1" }
      //         ]
      //     }
      // ],
      [asGridCoord(13, 1)]: [
        {
          events: [
            { who: "npc4", type: "walk", direction: "left" },
            { who: "npc4", type: "stand", direction: "up", time: 500 },
            { type: "textMessage", text: "You're too weak to go out there!" },
            { who: "npc4", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "down" },
          ],
        },
      ],
      [asGridCoord(12, 1)]: [
        {
          events: [
            { who: "npc4", type: "walk", direction: "left" },
            { who: "npc4", type: "walk", direction: "left" },
            { who: "npc4", type: "stand", direction: "up", time: 500 },
            { type: "textMessage", text: "You're too weak to go out there!" },
            { who: "npc4", type: "walk", direction: "right" },
            { who: "npc4", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "down" },
          ],
        },
      ],
    },
  },
  House1: {
    lowerSrc: "/images/maps/House1.png",
    // upperSrc: "/images/maps/House.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: withGrid(4),
        y: withGrid(5),
      }),
      npc1: new Person({
        x: withGrid(2),
        y: withGrid(2),
        src: "/images/characters/people/pikachu.png",
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "I smell like beef!",
                faceHero: "npc1",
              },
            ],
          },
        ],
      }),
    },
    walls: {
      // Western wall
      [asGridCoord(0, 1)]: true,
      [asGridCoord(0, 2)]: true,
      [asGridCoord(0, 3)]: true,
      [asGridCoord(0, 4)]: true,
      [asGridCoord(0, 5)]: true,
      [asGridCoord(0, 6)]: true,
      [asGridCoord(0, 7)]: true,
      // Southern wall
      [asGridCoord(1, 8)]: true,
      [asGridCoord(2, 8)]: true,
      [asGridCoord(3, 8)]: true,
      [asGridCoord(4, 8)]: true,
      [asGridCoord(5, 8)]: true,
      [asGridCoord(6, 8)]: true,
      [asGridCoord(7, 8)]: true,
      [asGridCoord(8, 8)]: true,
      [asGridCoord(9, 8)]: true,
      [asGridCoord(10, 8)]: true,
      [asGridCoord(11, 7)]: true,
      // Eastern wall
      [asGridCoord(11, 7)]: true,
      [asGridCoord(11, 6)]: true,
      [asGridCoord(12, 5)]: true,
      [asGridCoord(12, 4)]: true,
      [asGridCoord(12, 3)]: true,
      [asGridCoord(11, 2)]: true,

      // Northern wall
      [asGridCoord(1, 1)]: true,
      [asGridCoord(2, 1)]: true,
      [asGridCoord(3, 1)]: true,
      [asGridCoord(4, 1)]: true,
      [asGridCoord(4, 2)]: true,
      [asGridCoord(4, 3)]: true,
      [asGridCoord(5, 1)]: true,
      [asGridCoord(6, 1)]: true,
      [asGridCoord(7, 1)]: true,
      [asGridCoord(8, 1)]: true,
      [asGridCoord(9, 1)]: true,
      [asGridCoord(10, 1)]: true,
      [asGridCoord(11, 1)]: true,

      // Table
      [asGridCoord(7, 4)]: true,
      [asGridCoord(7, 5)]: true,
      [asGridCoord(8, 4)]: true,
      [asGridCoord(8, 5)]: true,
    },
    cutsceneSpaces: {
      [asGridCoord(4, 7)]: [
        {
          events: [{ type: "changeMap", map: "Town" }],
        },
      ],
    },
  },
};
