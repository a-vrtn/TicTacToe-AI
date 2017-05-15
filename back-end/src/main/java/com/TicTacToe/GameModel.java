package com.TicTacToe;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class GameModel {
	int score;
	// int depth;
	char[][] board;
	int boardSize;
	char player;
	char opponent;

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public char[][] getBoard() {
		return board;
	}

	public void setBoard(char[][] board) {
		this.board = board;
	}

	public int getBoardSize() {
		return boardSize;
	}

	public void setBoardSize(int boardSize) {
		this.boardSize = boardSize;
	}
	

	public char getPlayer() {
		return player;
	}

	public void setPlayer(char player) {
		this.player = player;
	}

	public char getOpponent() {
		return opponent;
	}

	public void setOpponent(char opponent) {
		this.opponent = opponent;
	}

	public boolean movesLeft() {
		for (int i = 0; i < boardSize; i++) {
			for (int j = 0; j < boardSize; j++) {
				if (board[i][j] == ' ')
					return true;
			}
		}
		return false;
	}

	public List<Integer> getAvailableMoves() {
		List<Integer> availableMoves = new ArrayList<>();
		for (int i = 0; i < boardSize; i++) {
			for (int j = 0; j < boardSize; j++) {
				if (board[i][j] == ' ')
					availableMoves.add(i * boardSize + j);
			}
		}
		return availableMoves;
	}

	public String calculateNextMove(String algorithm, char turn, int depth) {
		int move = 0;
		String message = evaluate();
		if (message == null) {
			if (algorithm.equals("random")) {
				move = randomAlgorithm(turn);
			} else {
				move = findBestMove(board, depth);
			}
			board[move / boardSize][move % boardSize] = turn;
			message = evaluate();
			return "{\"move\":\"" + move + "\",\"message\":\"" + message + "\"}";
		}
		return "{\"move\":\"" + -1 + "\",\"message\":\"" + message + "\"}";
	}

	private int minimaxAlgorithm(char board1[][], int depth, boolean isMax, int maxDepth) {
		int score = evaluateMinimax();
		if (score == 10)
			return score-depth;
		if (score == -10)
			return depth+score;
		if (movesLeft())
			return 0;
		if(depth==maxDepth)
			return 0;
		if (isMax) {
			int best = -1000;
			for (int i = 0; i < boardSize; i++) {
				for (int j = 0; j < boardSize; j++) {
					if (board1[i][j] == ' ') {
						board1[i][j] = player;
						best = max(best, minimaxAlgorithm(board1, depth + 1, !isMax, maxDepth));
						board1[i][j] = ' ';
					}
				}
			}
			return best;
		} else {
			int best = 1000;
			for (int i = 0; i < boardSize; i++) {
				for (int j = 0; j < boardSize; j++) {
					if (board1[i][j] == ' ') {
						board1[i][j] = opponent;
						best = min(best, minimaxAlgorithm(board1, depth + 1, !isMax, maxDepth));
						board1[i][j] = ' ';
					}
				}
			}
			return best;
		}
	}

	int findBestMove(char[][] board1, int depth) {
		int bestValue = -1000;
		int bestMove = -1;
		for (int i = 0; i < boardSize; i++) {
			for (int j = 0; j < boardSize; j++) {
				if (board1[i][j] == ' ') {
					board1[i][j] = player;
					int moveValue = minimaxAlgorithm(board1, 0, false, depth);
					board1[i][j] = ' ';
					if (moveValue > bestValue) {
						bestMove = (i * boardSize + j);
						bestValue = moveValue;
					}
				}
			}
		}
		return bestMove;
	}

	private int min(int element1, int element2) {
		if (element1 < element2)
			return element1;
		if (element1 > element2)
			return element2;
		Random rand= new Random();
		if(rand.nextInt(2)==0)
			return element1;
		return element2;
	}

	private int max(int element1, int element2) {
		if (element1 > element2)
			return element1;
		
		if (element1 < element2)
			return element2;
		Random rand= new Random();
		
		if(rand.nextInt(2)==0)
			return element1;
		return element2;
		
	}

	public int randomAlgorithm(char turn) {
		List<Integer> availableMoves = getAvailableMoves();
		if (availableMoves.isEmpty())
			return -1;
		Random rand = new Random();
		int randomMove = rand.nextInt(availableMoves.size());
		return availableMoves.get(randomMove);
	}

	public int evaluateMinimax() {

		if (hasWon(player))
			return +10;
		if (hasWon(opponent))
			return -10;
		// if (movesLeft() == false)
		// return 0;
		return 0;

	}

	public String evaluate() {
		if (hasWon('X'))
			return "X has won";
		if (hasWon('O'))
			return "O has won";
		if (movesLeft() == false)
			return "it's a draw";
		return null;

	}

	public boolean hasWon(char turn) {
		int vertical_count = 0, horizontal_count = 0, right_to_left_count = 0, left_to_right_count = 0;
		// Checking for Rows for X or O victory.
		for (int i = 0; i < boardSize; i++) {
			vertical_count = 0;
			horizontal_count = 0;
			for (int j = 0; j < boardSize; j++) {
				if (board[i][j] == turn) {
					horizontal_count++;
				}

				if (board[j][i] == turn) {
					vertical_count++;
				}
			}
			if (board[i][i] == turn) {
				left_to_right_count++;
			}

			if (board[(boardSize - 1 - i)][i] == turn) {
				right_to_left_count++;
			}

			if (horizontal_count == boardSize || vertical_count == boardSize) {
				return true;
			}

		}
		if (left_to_right_count == boardSize || right_to_left_count == boardSize) {
			return true;
		}
		return false;
	}
}
