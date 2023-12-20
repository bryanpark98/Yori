import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  PanResponder,
  View,
  Pressable,
  Dimensions,
  StyleSheet,
  Text,
  ColorValue,
  TouchableWithoutFeedback,
  PanResponderInstance,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import ApiProvider, { useApi } from "../../contexts/ApiProvider";
import md5 from "md5";
import { IRestaurantPrivate, ITable, IProduct } from "@yori/types";
import { theme } from "@yori/styles";
import stringToColor from "../../utils/string_to_color";

const { width, height } = Dimensions.get("window");

type LineRender = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: ColorValue;
};

type Position = {
  x: number;
  y: number;
};

// TODO: make more performant
const ItemSelectorGrid = ({
  restaurant,
  selectTable,
  selectProduct,
}: {
  restaurant: IRestaurantPrivate | null;
  selectTable: (table: ITable) => void;
  selectProduct: (item: IProduct) => void;
}) => {
  const [renderedLines, setRenderedLines] = useState<(LineRender | null)[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([0, -1, -1, -1]);

  const [containerPosition, setContainerPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [columnPosition, setColumnPosition] = useState<Position[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const [grid, setGrid] = useState<
    Array<
      Array<{
        color: ColorValue;
        animation: Animated.Value;
        width: number;
        height: number;
        relativePosition: Position;
      }>
    >
  >([[], [], [], []]);

  const checkMouseInteraction = (clickX: number, clickY: number) => {
    let isOverlapping;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const columnIndex = i;
        const rowIndex = j;

        const ref = grid[columnIndex][rowIndex];
        if (!ref) return;

        const gridCellX =
          ref.relativePosition.x + columnPosition[columnIndex].x;
        const gridCellY =
          ref.relativePosition.y + columnPosition[columnIndex].y;

        isOverlapping =
          clickX >= gridCellX &&
          clickX <= gridCellX + ref.width &&
          clickY >= gridCellY &&
          clickY <= gridCellY + ref.height;

        if (!isOverlapping) continue;

        // Expand rows corresponding to overlap
        // Animate if first time snapping
        if (selectedRows[columnIndex] !== rowIndex) {
          // TODO: animations are too slow
          // Animated.timing(ref.animation, {
          //   toValue: 1,
          //   duration: 100,
          //   useNativeDriver: false,
          // }).start(() => {
          //   console.log(ref.animation, "done");
          //   Animated.timing(ref.animation, {
          //     toValue: 0,
          //     duration: 100,
          //     useNativeDriver: false,
          //   }).start(() => {});
          // });
          setSelectedRows((prevRows) => {
            // Clear grid refs after active line
            for (let i = columnIndex + 1; i < 4; i++) {
              setGrid((prevGrid) => {
                prevGrid[i] = [];
                return prevGrid;
              });
            }

            return prevRows.map((row, idx) => {
              if (idx === columnIndex) return rowIndex;
              return idx > columnIndex ? -1 : row;
            });
          });
        }
      }
    }
    return isOverlapping;
  };

  useEffect(() => {
    const selectedTable = restaurant?.tables[selectedRows[0]];
    if (selectedTable) {
      selectTable(selectedTable);
    }
  }, [selectedRows, grid]);

  useEffect(() => {
    const updateLines = async () => {
      const renderedLines: (LineRender | null)[] = await Promise.all(
        selectedRows.map((row, columnIndex) => {
          if (selectedRows[columnIndex] === -1) return null;

          const startRect = grid[columnIndex][selectedRows[columnIndex]];
          if (!startRect) return null;

          if (selectedRows.length <= columnIndex + 1) return null;

          const endRect = grid[columnIndex + 1][selectedRows[columnIndex + 1]];
          if (!endRect) return null;

          const startGridCellX =
            startRect.relativePosition.x + columnPosition[columnIndex].x;
          const startGridCellY =
            startRect.relativePosition.y + columnPosition[columnIndex].y;
          const endGridCellX =
            endRect.relativePosition.x + columnPosition[columnIndex + 1].x;
          const endGridCellY =
            endRect.relativePosition.y + columnPosition[columnIndex + 1].y;

          return {
            startX: startGridCellX + startRect.width / 2,
            startY: startGridCellY + startRect.height / 2,
            endX: endGridCellX + endRect.width / 2,
            endY: endGridCellY + endRect.height / 2,
            color: endRect.color,
          };
        }),
      );
      setRenderedLines(renderedLines);
    };
    updateLines();
  }, [selectedRows, restaurant, grid, columnPosition]);

  let panResponder = useRef<PanResponderInstance>();

  useEffect(() => {
    if (panResponder.current?.panHandlers) {
      panResponder.current.panHandlers = {};
    }
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: (event) => {
        return true;
      },
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderStart: async (event, gestureState) => {
        const { locationX, locationY } = event.nativeEvent;
        checkMouseInteraction(locationX, locationY);
      },
      onPanResponderMove: async (event, gestureState) => {
        const { locationX, locationY } = event.nativeEvent;
        checkMouseInteraction(locationX, locationY);
      },
      onPanResponderRelease: (event) => {
        // Select product if it exists and is selected
        if (selectedRows[3] !== -1) {
          const selectedProduct =
            restaurant?.menus[selectedRows[1]].menuSections[selectedRows[2]]
              .menuItems[selectedRows[3]];
          if (selectedProduct) {
            selectProduct(selectedProduct);
          }
        }
      },
    });
  }, [
    grid,
    columnPosition,
    restaurant,
    selectProduct,
    selectTable,
    selectedRows,
  ]);

  const GridCell = ({
    title,
    rowIndex,
    columnIndex,
  }: {
    title: string;
    color?: ColorValue;
    rowIndex: number;
    columnIndex: number;
  }) => {
    const color = useMemo(() => stringToColor(title), [title]);

    // const animatedStyle = {
    //   opacity: grid[columnIndex][rowIndex]?.animation || 0,
    // };

    return (
      <View
        style={{
          padding: 8,
          width: "100%",
        }}
        onLayout={(event) => {
          const { width, height, x, y } = event.nativeEvent.layout;
          if (
            grid[columnIndex][rowIndex]?.relativePosition?.x === x &&
            grid[columnIndex][rowIndex]?.relativePosition?.y === y
          ) {
            return;
          }
          // if (grid[columnIndex][rowIndex]?.animation) {
          // grid[columnIndex][rowIndex]?.animation.stopAnimation();
          // grid[columnIndex][rowIndex]?.animation.removeAllListeners();
          // }
          setGrid((prevGrid) => {
            prevGrid[columnIndex][rowIndex] = {
              color,
              relativePosition: { x, y },
              width,
              height,
              animation: new Animated.Value(0),
            };
            return prevGrid;
          });
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            opacity: 0.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View
            style={[
              {
                position: "relative",
                width: "100%",
                height: "100%",
                backgroundColor: color,
                opacity: 0,
              },
              // animatedStyle,
            ]}
          />
        </View>
        <View collapsable={false} id={title}>
          <View
            style={{
              backgroundColor: theme.colors.primaryBackground,
              ...theme.shadow,
            }}
          >
            <View
              style={{
                padding: 6,
                borderLeftColor: color,
                borderLeftWidth: 4,
              }}
            >
              <Text style={{ color: "white", fontSize: 12 }} selectable={false}>
                {title}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{ flex: 1, flexDirection: "row" }}
      onLayout={(event) => {
        const { x, y } = event.nativeEvent.layout;
        setContainerPosition({ x, y });
      }}
    >
      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: "absolute",
          zIndex: 100,
        }}
        {...panResponder?.current?.panHandlers}
      />
      {renderedLines.map((line, index) => {
        if (!line) return null;
        const startX = line.startX;
        const startY = line.startY;
        const endX = line.endX;
        const endY = line.endY;
        return (
          <Svg
            key={index}
            height={height}
            width={width}
            style={{ position: "absolute" }}
          >
            <Path
              d={`M${startX},${startY} L${
                (endX - startX) / 2 + startX
              },${startY} L${
                (endX - startX) / 2 + startX
              },${endY} L${endX},${endY}`}
              stroke={line.color}
              strokeWidth={4}
              fill="transparent"
            />
          </Svg>
        );
      })}
      <View
        style={{
          backgroundColor: "transparent",
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
        }}
      >
        {[
          restaurant?.tables,
          restaurant?.menus,
          selectedRows[1] !== -1
            ? restaurant?.menus[selectedRows[1]].menuSections
            : [],
          selectedRows[2] !== -1 && selectedRows[1] !== -1
            ? restaurant?.menus[selectedRows[1]].menuSections[selectedRows[2]]
                .menuItems
            : [],
        ].map((data, columnIndex) => {
          return (
            <View
              key={columnIndex}
              style={{
                paddingRight: 15,
                width: "25%",
                height: "100%",
                justifyContent: "center",
              }}
              onLayout={(event) => {
                setColumnPosition([
                  ...columnPosition.slice(0, columnIndex),
                  {
                    x: event.nativeEvent.layout.x,
                    y: event.nativeEvent.layout.y,
                  },
                  ...columnPosition.slice(columnIndex + 1),
                ]);
              }}
            >
              {(data || []).map((item, rowIndex) => (
                <GridCell
                  key={rowIndex}
                  title={item.name}
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                />
              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ItemSelectorGrid;
