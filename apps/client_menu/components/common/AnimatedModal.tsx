import { theme } from "@yori/styles";
import React from "react";
import { View, Modal, TouchableOpacity } from "react-native";

interface AnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableOpacity
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            backgroundColor: theme.colors.primaryBackground,
            borderRadius: 8,
            width: "80%",
          }}
          onPress={() => {}}
          activeOpacity={1}
        >
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default AnimatedModal;
