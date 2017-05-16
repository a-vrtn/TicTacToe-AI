package com.TicTacToe;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class GameService {
	@CrossOrigin(origins = "*", maxAge = 3600)
	@PostMapping(value  = "/V1/didWin")
	public String didWin(@RequestParam (value = "board[]" , required = true)  char[] boardArray,
			@RequestParam (value = "turn" , required = true, defaultValue = "")  char turn,
			@RequestParam (value = "boardSize" , required = true)  int boardSize)
	{
		GameModel gm= new GameModel();
		char board[][]=new char[boardSize][boardSize];
		int counter=0;
		
		for(int i=0;i<boardSize;i++)
		{
			for(int j=0;j<boardSize;j++)
			{
				board[i][j]=boardArray[counter];
				counter++;
			}
		}
		gm.setBoard(board);
		gm.setBoardSize(boardSize);
		boolean message=  gm.hasWon(board, turn);
				
		return "{ \"message\":\"" + message + "\"}";
	}
	
	
	@CrossOrigin(origins = "*", maxAge = 3600)
	@PostMapping(value  = "/V1/nextMove")
	public String nextMove(@RequestParam (value = "board[]" , required = true)  char[] boardArray,
			@RequestParam (value = "turn" , required = true, defaultValue = "")  char turn,
			@RequestParam (value = "depth" , required = false, defaultValue = "0")  int depth,
			@RequestParam (value = "boardSize" , required = true)  int boardSize,
			@RequestParam (value = "algorithm" , required = true)  String algorithm)
	{
		GameModel gm= new GameModel();
		char board[][]=new char[boardSize][boardSize];
		int counter=0;
		for(int i=0;i<boardSize;i++)
		{
			for(int j=0;j<boardSize;j++)
			{
				if(boardArray[counter]!='-')
					board[i][j]=boardArray[counter];
				else
					board[i][j]=' ';
				counter++;
			}
		}
		gm.setPlayer(turn);
		char opponent='O';
		if(turn=='O')
			opponent='X';
		gm.setOpponent(opponent);
		gm.setBoard(board);
		gm.setBoardSize(boardSize);
		return gm.calculateNextMove(algorithm, turn, depth);
	}
}
