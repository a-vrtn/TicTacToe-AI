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
	boolean shouldPrune;
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

	public boolean movesLeft(char tmpBoard[][]) {
		for (int i = 0; i < boardSize; i++) {
			for (int j = 0; j < boardSize; j++) {
				if (tmpBoard[i][j] == ' ')
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
		String message = evaluate(board);
		if (message == null) {
			char board2[][] = new char[boardSize][boardSize];
				for (int i = 0; i < boardSize; i++) {
				for (int j = 0; j < boardSize; j++) {
					board2[i][j] = board[i][j];
				}
			}
			if (algorithm.equals("random")) {
				move = randomAlgorithm(turn);
			} else {
				
				move = findBestMove(depth);
			}
			board2[move / boardSize][move % boardSize] = turn;
			message = evaluate(board2);
			return "{\"move\":\"" + move + "\",\"message\":\"" + message + "\"}";
		}
		return "{\"move\":\"" + -1 + "\",\"message\":\"" + message + "\"}";
	}

	private int minimaxAlgorithm(char tmpBoard[][], boolean isMax, int maxDepth, int alpha, int beta) {
		int score = evaluateMinimax(tmpBoard);
		if (maxDepth == 0)
			return score;
		if (score == 10)
			return score;
		// return score - depth;
		if (score == -10)
			return score;
		// return depth + score;
		if (movesLeft(tmpBoard) == false)
			// return 0- depth;
			return 0;
		// if (depth == maxDepth)
		// return 0;
		if (isMax) {
			int best = -1000;
			for (int i = 0; i < boardSize; i++) {
				for (int j = 0; j < boardSize; j++) {
					if (tmpBoard[i][j] == ' ') {
						tmpBoard[i][j] = player;
						int value = minimaxAlgorithm(tmpBoard, !isMax, maxDepth - 1, alpha, beta);
						best = max(best, value);
						if (boardSize > 3) {
							if (best > alpha)
								alpha = best;
							if (alpha >= beta)
								break; // beta cut-off
						}
						tmpBoard[i][j] = ' ';
					}
				}
			}
			return best;
		} else {
			int best = 1000;
			for (int i = 0; i < boardSize; i++) {
				for (int j = 0; j < boardSize; j++) {
					if (tmpBoard[i][j] == ' ') {
						tmpBoard[i][j] = opponent;
						int value = minimaxAlgorithm(tmpBoard, !isMax, maxDepth - 1, alpha, beta);
						best = min(best, value);
						if (shouldPrune) {
							if (best < beta)
								beta = best;
							if (alpha >= beta)
								break; // alpha cut-off
						}
						tmpBoard[i][j] = ' ';
					}
				}
			}
			return best;
		}
	}

	int findBestMove(int depth) {
		char[][] tmpBoard = board;
		int bestValue = -1000;
		int bestMove = -1;
		Random rand = new Random();
		shouldPrune=false;
		if(boardSize>3 && depth==boardSize*boardSize)
			shouldPrune=true;
		for (int i = 0; i < boardSize; i++) {
			for (int j = 0; j < boardSize; j++) {
				if (tmpBoard[i][j] == ' ') {
					tmpBoard[i][j] = player;
					int moveValue = minimaxAlgorithm(tmpBoard, false, depth, -1000, 1000);
					tmpBoard[i][j] = ' ';
					if (moveValue > bestValue) {
						bestMove = (i * boardSize + j);
						bestValue = moveValue;
					}
					if (moveValue == bestValue) {
						if (rand.nextInt(2) == 0) {
							bestMove = (i * boardSize + j);
							bestValue = moveValue;
						}
					}
				}
			}
		}
		return bestMove;
	}

	private int min(int element1, int element2) {
		if (element1 < element2)
			return element1;
		return element2;
	}

	private int max(int element1, int element2) {
		if (element1 > element2)
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

	public int evaluateMinimax(char tmpBoard[][]) {

		if (hasWon(tmpBoard, player))
			return +10;
		if (hasWon(tmpBoard, opponent))
			return -10;
		// if (movesLeft() == false)
		// return 0;
		return 0;

	}

	public String evaluate(char tmpBoard[][]) {
		if (hasWon(tmpBoard, 'X'))
			return "X has won";
		if (hasWon(tmpBoard, 'O'))
			return "O has won";
		if (movesLeft(tmpBoard) == false)
			return "it's a draw";
		return null;

	}

	public boolean hasWon(char tmpBoard[][], char turn) {
		int vertical_count = 0, horizontal_count = 0, right_to_left_count = 0, left_to_right_count = 0;
		// Checking for Rows for X or O victory.
		for (int i = 0; i < boardSize; i++) {
			vertical_count = 0;
			horizontal_count = 0;
			for (int j = 0; j < boardSize; j++) {
				if (tmpBoard[i][j] == turn) {
					horizontal_count++;
				}

				if (tmpBoard[j][i] == turn) {
					vertical_count++;
				}
			}
			if (tmpBoard[i][i] == turn) {
				left_to_right_count++;
			}

			if (tmpBoard[(boardSize - 1 - i)][i] == turn) {
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
