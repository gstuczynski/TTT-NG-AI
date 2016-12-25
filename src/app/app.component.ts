import { Component, Input } from '@angular/core';
import { GameField } from './game.field';
import { NgFor } from '@angular/common';
import { FormsModule}   from '@angular/forms';
import { GameFieldComponent } from './game.field.component';

//import { GameBoardComponent } from './game.board.component';
import { GameBoard } from './game.board';

@Component({
  selector: 'app-root',
  //  directives: []
  templateUrl: './app.component.html',
  //directives: [ GameFieldComponent ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {



  //inicjalizuje maciez gry, do konstruktora przekazuje rozmiar
  gameBoard = new GameBoard(10);
  board = this.gameBoard.board;
  flatBoard = this.gameBoard.flatBoard;
textBoardImp : string[];
      gState : string = "" ;//do eksportu

  clickedField: GameField;//zmienna reprezentująca klikniete pole

  //obsługa kliknięcia. sprowadza się do zmiany garacza, reszta dzieje się w template
  handleClick(field: GameField): void {
    this.clickedField = field;
    //sprawdzam czyj powinien byc teraz ruch - funkcja w gameBoard
    var player = this.gameBoard.playerTurn(this.board);
    //console.log(player);
    this.clickedField.player = player;
    this.gameBoard.lastTurn = player;
    this.gameBoard.checkWin(field)
  }

  aiMove() {

    this.gameBoard.rateAllFields();//oceniam pola z perspwktywy korzysci
    var player = this.gameBoard.playerTurn(this.board);
    //oceniam z perspektywy przeciwnika
    if (player == 1) {
      this.gameBoard.rateAllFields(2, false);
    } else if (player == 2) {
      this.gameBoard.rateAllFields(1, false);
    }
//z tablicy z ocenami wybieram nalepszą
    var chField: GameField = this.gameBoard.findMax();
    //console.log(chField);
    if (chField == undefined) {
      alert(chField);
    }
    chField.player = player;
    this.gameBoard.lastTurn = player;
    //console.log(this.gameBoard.bestFields)
    this.gameBoard.checkWin(chField)
  }
  checkWin() {
  //  this.gameBoard.checkWin();


  }
  handleImport(textBoard: string) {
   this.textBoardImp = (textBoard.split(/\n/)) // dziele na wiersze

    var row;
    for (var i = 0; i < this.textBoardImp.length; i++) { //dla kazdego wiersza
      row = this.textBoardImp[i].split(",");

      if (row[0] == '1') {
        this.gameBoard.flatBoard[Number(row[1] + row[2])].player = 1;
      } else if (row[0] == '0') {
        this.gameBoard.flatBoard[row[1] + row[2]].player = 2;
      }

    }

  }

  handleExport() {

    for (var i = 0; i < this.gameBoard.flatBoard.length; i++) {
        if (this.gameBoard.flatBoard[i].player != 0) {
//this.gState.trim();
var p = this.gameBoard.flatBoard[i].player-1;
  this.gState = (this.gState + p +","+ i/10 + '\n').replace(".",",");

    }
  }
  //console.log(this.gState);
  }


}
/*
var size=6;

//dla zadanej ilosci(size) tworze maciez i wypelniam ja obiektami GameField o iterowanym id
  var GAMEBOARD=[];
  var x=0;
  for(var i=0;i<size;i++){
  for (var j=0; j < size; j++) {
    if (!GAMEBOARD[i]) {
        GAMEBOARD[i] = [];        //przy pierwszej iteracji wiersz nie jest tablica
    }
    GAMEBOARD[i][j]=new GameField(x);
    x++;
  }
};

/*
  chosePlayer(): void {
      //decyduje czyj ruch-ten kto ma mniej pionkow
      var circles = 0;
      var crosses = 0;
      for (var i = 0; i < gameBoard.length; i++) {
          if (gameBoard[i] == 0) {
              circles++;
          }
          else if (gameBoard[i] === 1) {
              crosses++;
          }
      }
      if (circles > crosses || (circles == crosses && lastPlayer == "circle")) {
          return 1;
      }
      else if (crosses > circles || (circles == crosses && lastPlayer == "cross")) {
          return -1;
      }
      else {
          alert("coś nie obsłużone");
      }
  }





////function init() {


//    console.log(document.getElementById("gboard"));

  //  table.onclick = function() {
    //    console.log(table);
  //  };


/*
    if (table != null) {
        for (var i = 0; i < table.rows.length; i++) {
            for (var j = 0; j < table.rows[i].cells.length; j++)
                table.rows[i].cells[j].onclick = function() {
                    HandleTableClick(this);
                };
        }
    }



};
function HandleTableClick(tableCell) {
    /*  console.log(tableCell.id);
      model.rateField(tableCell.id);
      var x = -1;
      alert(x * (-1));
      */
  //  controller.humanMove(tableCell.id);*/
//};
