export class NumberUtils {

    public static positionToPoints(pos: number): number {
        switch (pos) {
          case 1:
            return 15;
          case 2:
            return 12;
          case 3:
            return 10;
          case 4:
            return 9;
          case 5:
            return 8;
          case 6:
            return 7;
          case 7:
            return 6;
          case 8:
            return 5;
          case 9:
            return 4;
          case 10:
            return 3;
          case 11:
            return 2;
          case 12:
            return 1;
          default:
            return 0;
        }
      }

      public static pointsToPosition(points: number): number {
        switch (points) {
          case 15:
            return 1;
          case 12:
            return 2;
          case 10:
            return 3;
          case 9:
            return 4;
          case 8:
            return 5;
          case 7:
            return 6;
          case 6:
            return 7;
          case 5:
            return 8;
          case 4:
            return 9;
          case 3:
            return 10;
          case 2:
            return 11;
          case 1:
            return 12;
          default:
            return 0;
        }
      }

      public static round(num: number, digits: number) : number {
        const factor = 10 ** digits;
        return Math.round(num * factor) / factor;
      };

}