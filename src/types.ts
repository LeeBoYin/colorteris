export class Color {
	constructor(
		public hue: number,
		public saturation: number,
		public lightness: number) {
	}

	isSame(color: Color) {
		return this.hue === color.hue &&
			this.saturation === color.saturation &&
			this.lightness === color.lightness;
	}
}
export class Coordinate {
	constructor(
		public x: number,
		public y: number) {
	}
	isSame(coordinate: Coordinate) {
		return coordinate.x === this.x &&
			coordinate.y === this.y;
	}
}

export class Brick {
	public id: string;
	constructor(public color: Color) {
		this.id = Math.floor(performance.now()).toString();
	}
}

