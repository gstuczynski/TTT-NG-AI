import { GameField } from './game.field';


export class GameBoard {
  size: number;//rozmiar planszy
  board = [];//plansza zawierajaca obiekty kazego pola
  lastTurn: number = 1;//ostatni ruch
  neighbours = [-1, 1, -9, 9, -10, 10, -11, 11];
  flatBoard = [];//ta sama tablica gry tylko o plaskiej strukturze
  bestFields = [];
  neighboursChecked = [];//do sprawdzania wygranej

  constructor(size: number) {
    //do konstruktora podaje rozmiar, w petli tworze teblice tablic(wierszow) dla obiektu GameField
    var GAMEBOARD = [];
    var x = 0;
    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        if (!GAMEBOARD[i]) {
          GAMEBOARD[i] = [];        //przy pierwszej iteracji wiersz nie jest tablica
        }
        GAMEBOARD[i][j] = new GameField(x);
        this.flatBoard[x] = GAMEBOARD[i][j];
        x++;
      }
    }
    this.board = GAMEBOARD;
  }

  //szukam czyj teraz ruch
  playerTurn(board): number {
    var circles = 0;
    var crosses = 0;

    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        if (board[i][j].player == 1) {
          crosses++;
        } else if (board[i][j].player == 2) {
          circles++;
        }
      }
    }
    if (circles > crosses || (circles == crosses && this.lastTurn == 2)) {
      return 1;
    }
    else if (crosses > circles || (circles == crosses && this.lastTurn == 1)) {
      return 2;
    } else {
      alert("no chosen player exception");
    }
  }

  rateAllFields(player?: number, resetRate?: boolean) {
    /*najperw sprwdzam czyja runda, następnie czochram każde pole, jak znajde sasiada uruchamiam nextNeighbour
    ktore podbija ocene. na samym koncu przypisuje ocene do obiektu pola, dodatkowy parametr - jezeli true
    oceny liczy od nowa, tez podanie gracza opcjionalne, jezeli puste - sam kmini*/
    var reset = resetRate || true
    var player = player || this.playerTurn(this.board);
    //console.log(player);
    this.flatBoard[45].rate += 1;//tak zeby od srodka zaczynali
    for (var i = 0; i < this.flatBoard.length; i++) {
      if (!reset) {
        this.flatBoard[i].rate = 0;
      }

      var rate = 0;
      for (var j = 0; j < this.neighbours.length; j++) {
        var nfield = (i + this.neighbours[j]);
        if (nfield % 10 == 0 && (this.neighbours[j] == -9 || this.neighbours[j] == 1 || this.neighbours[j] == 11)) {

        }

        //console.log(nfield);
        if ((this.flatBoard[nfield] != undefined) && (this.flatBoard[i].player === 0)) {
          //sprawdzam czy nie wylatuje poza tablicę oraz czy pole jest puste
          if (player === this.flatBoard[nfield].player) {

            if (i%10 == 0 && (this.neighbours[j] == -9 ||
              this.neighbours[j] == 1 || this.neighbours[j] == 11)) {
              rate = 0;
            } else {
              rate += this.nextNeighbour(this.neighbours[j], this.flatBoard[i], player, rate + 1)

            }
          }
        }

      }

      if (!reset) {
        //tutaj zwiększam punkty dla oceny włanych korzyści(uruchamia metod AImove)
        rate += 100;
      }
      this.flatBoard[i].rate += rate;
    }
  }

  nextNeighbour(direct: number, field: GameField, player: number, rate?: number, iter?: number) {
    /* dla wskazanego pola sprawdzam czy w skazanym kierunku nie ma więcej sąsiadów, jak są uruchamiam się rekurencyjnie*/
    var i = iter || 1;
    var nfield = field.id + direct;
    var rate = rate || 1;

    if (this.neighboursChecked[i - 1] == undefined || this.neighboursChecked[i - 1].player == player) {
      this.neighboursChecked[i] = field;
    }

    if (this.flatBoard[nfield] != undefined && this.flatBoard[nfield].player == player) {
      console.log("dir" + direct + "id:  " + nfield);
      if (field.id % 10 == 0 && (direct == -9 || direct == 1 || direct == 11)) {
        rate = 0;
        console.log("wlosz");
      } else {

        if (field.id%10 == 0 && (direct == -9 ||
          direct == 1 || direct == 11)) {
          rate = 5;
        } else {


        rate += this.nextNeighbour(direct, this.flatBoard[nfield], player, rate + 1, i + 1);
      }
    }
    }
    //console.log(this.neighboursChecked);

    return rate + Math.pow(rate, i)



  }
  findMax(): GameField {
    //zwraca obiekt z najwyzsza ocena - do obsluzenia losowanie jezeli sa takie same wartosci
    var maxval = 0;
    var maxf = 0;
    for (var i = 0; i < this.flatBoard.length - 1; i++) {

      if (maxval < this.flatBoard[i].rate && this.flatBoard[i].player == 0) {
        maxval = this.flatBoard[i].rate;
        maxf = i;

      }

    }

    return this.flatBoard[maxf];
  }
  checkWin(fieldCheck: GameField) {
    /*Do neighboursChecked wrzucam sasiednie obiekty GameField
    */
    var oNplayer = fieldCheck.player;
    if (fieldCheck == undefined || fieldCheck.player == 0) {
      alert(fieldCheck.id + "  ret")
      return false;
    }
    for (var i = 0; i < this.neighbours.length; i++) {

      var currentNeighbVal = this.neighbours[i];
      //  if (i % 2 == 0) {
      this.neighboursChecked = [];
      //    }

      var curr = fieldCheck.id + currentNeighbVal;
      var currTmp = curr;
      //warunej jezeli mam pelna 10 i wczesniejsze sparwdzane pole konczy suie na
      //9 to return

      //dopoki na sasiednim polu jest ten sam gracz - sprawdzam kazde pole w danym kierunku
      while (this.flatBoard[curr] != undefined && fieldCheck.player == this.flatBoard[curr].player
        && curr >= 0 && curr < 100) {


        this.neighboursChecked.push(this.flatBoard[curr]);
        curr += currentNeighbVal;
      }
      if (this.neighboursChecked.length >= 4) {
        fieldCheck.player = 3;
        for (var i = 0; i < this.neighboursChecked.length; i++) {
          this.neighboursChecked[i].player = 3;
        }
        var winner;

        if (oNplayer == 2) {
          winner = "Kółko"
        } else {
          winner = "Krzyżyk"
        }
        var w = confirm("Wygrywa " + winner + ". Zacząć od nowa?");
        if (w == true) {
          //delete this;
          //new GameBoard(10);
          location.reload();
        }
        return;
      }
      //  console.log(this.neighboursChecked);


    }
  }







}
