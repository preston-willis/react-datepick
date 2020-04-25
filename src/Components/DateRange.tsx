import ms from "ms";

export default class DateRange {
  text: string;
  startDate: Date;
  endDate: Date;

  constructor(text) {
    this.text = text;
    this.startDate = new Date();
    this.endDate = new Date();
  }

  quickSelectFormat() {
    if (this.text.includes("Next")) {
      this.startDate = new Date();
      this.endDate = new Date();
      this.endDate.setTime(this.startDate.getTime() + ms(this.text.slice(5)));
    } else if (this.text.includes("Last")) {
      this.startDate = new Date();
      this.endDate = new Date();
      this.startDate.setTime(this.startDate.getTime() - ms(this.text.slice(5)));
    }
  }
}
