
export class GameField{
  id:number;
rate:number;
player:number;//0-puste, 1-krzyzyk, 2-kolko



constructor(id:number, player?:number){
  this.id=id;
  this.player=player || 0;//domyślna wartość 0
  this.rate=0;
}

rateYourself(board): void {
//console.log(board);
}


}
