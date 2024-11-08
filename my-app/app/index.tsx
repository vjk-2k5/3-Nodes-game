import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, StyleSheet, TouchableOpacity, Animated } from "react-native";
import {
  generateInitialGrid,
  findMatches,
  removeMatchesAndUpdateGrid,
  swapTiles,
  isAdjacent,
  GRID_SIZE,
  TILE_COLORS,
  hasPossibleMoves,
} from "./gameLogic";

const INITIAL_TIME = 60;

export default function Index() {
  const [grid, setGrid] = useState(generateInitialGrid());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [lastMove, setLastMove] = useState<{
    grid: string[][];
    score: number;
  } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number } | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft]);

  useEffect(() => {
   
    let matches = findMatches(grid);
    if (matches.length > 0) {
      setGrid(removeMatchesAndUpdateGrid(grid, matches));
      setScore((prev) => prev + matches.length * 10);
    } else if (!hasPossibleMoves(grid)) {
      
      let newGrid = generateInitialGrid();
      setGrid(newGrid);
    }
  }, [grid]);

  function handleTilePress(row: number, col: number) {
    if (selectedTile) {
      const pos1 = selectedTile;
      const pos2 = { row, col };
      if (isAdjacent(pos1, pos2)) {
        const newGrid = swapTiles(grid, pos1, pos2);
        const matches = findMatches(newGrid);
        if (matches.length > 0) {
          setLastMove({ grid: grid, score: score });
          setGrid(newGrid);
        } else {
         
          setSelectedTile(null);
        }
      }
      setSelectedTile(null);
    } else {
      setSelectedTile({ row, col });
    }
  }

  function handleUndo() {
    if (lastMove) {
      setGrid(lastMove.grid);
      setScore(lastMove.score);
      setLastMove(null);
    }
  }

  function handleRestart() {
    setGrid(generateInitialGrid());
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setLastMove(null);
    setGameOver(false);
    setSelectedTile(null);
  }

  if (gameOver) {
    return (
      <View style={styles.overlay}>
        <Text style={styles.gameOverText}>Game Over</Text>
        <Text style={styles.finalScoreText}>Final Score: {score}</Text>
        <Button title="Restart" onPress={handleRestart} />
        <Button title="Exit" onPress={() => {}} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
      <View style={styles.grid}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((color, colIndex) => {
              const isSelected =
                selectedTile?.row === rowIndex && selectedTile?.col === colIndex;
              return (
                <TouchableOpacity
                  key={colIndex}
                  onPress={() => handleTilePress(rowIndex, colIndex)}
                >
                  <Animated.View
                    style={[
                      styles.tile,
                      { backgroundColor: color },
                      isSelected && styles.selectedTile,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.undoButton} onPress={handleUndo}>
        <Text style={styles.undoButtonText}>Undo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 24,
  },
  scoreText: {
    fontSize: 24,
  },
  grid: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  tile: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTile: {
    borderWidth: 2,
    borderColor: "white",
  },
  undoButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  undoButtonText: {
    fontSize: 18,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 20,
  },
  finalScoreText: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
});
