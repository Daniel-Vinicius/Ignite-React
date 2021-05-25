import { useEffect, useState } from "react";

export function Async(): JSX.Element {
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true);
    }, 1000);
  });

  return (
    <div>
      <h4>Hello World</h4>
      {isButtonVisible && <button>Button</button>}
      {!isButtonVisible && <button>Button Removed</button>}
    </div>
  );
}
