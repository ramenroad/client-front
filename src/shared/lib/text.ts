import { disassemble } from "es-hangul";

export const getTextMatch = ({
  query,
  target,
}: {
  query: string;
  target: string;
}): {
  matchedText: string;
  unMatchedText: string;
} => {
  const queryDisassembled = disassemble(query);
  const targetDisassembled = disassemble(target);
  const queryLower = query.toLowerCase();
  const targetLower = target.toLowerCase();

  if (targetDisassembled.startsWith(queryDisassembled)) {
    return {
      matchedText: target.substring(0, query.length),
      unMatchedText: target.substring(query.length),
    };
  }

  if (targetLower.startsWith(queryLower)) {
    return {
      matchedText: target.substring(0, query.length),
      unMatchedText: target.substring(query.length),
    };
  }

  const disassembledIndex = targetDisassembled.indexOf(queryDisassembled);

  if (disassembledIndex !== -1) {
    let originalIndex = 0;
    let currentDisassembledIndex = 0;

    for (let index = 0; index < target.length; index += 1) {
      if (currentDisassembledIndex >= disassembledIndex) {
        break;
      }

      currentDisassembledIndex += disassemble(target[index]).length;
      originalIndex = index + 1;
    }

    return {
      matchedText: target.substring(originalIndex, originalIndex + query.length),
      unMatchedText: target.substring(0, originalIndex) + target.substring(originalIndex + query.length),
    };
  }

  const normalIndex = targetLower.indexOf(queryLower);

  if (normalIndex !== -1) {
    return {
      matchedText: target.substring(normalIndex, normalIndex + query.length),
      unMatchedText: target.substring(0, normalIndex) + target.substring(normalIndex + query.length),
    };
  }

  return {
    matchedText: "",
    unMatchedText: target,
  };
};
