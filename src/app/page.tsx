"use client";

import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const Page: React.FC = () => {
  const generateRandomNumber = () => {
    while (true) {
      const randomNumber = Math.floor(Math.random() * (9876 - 1023 + 1)) + 1023;
      const digits = new Set(randomNumber.toString().split(""));

      if (digits.size === 4) {
        return randomNumber;
      }
    }
  };

  const calculateFeedback = (holdingNumber: string, guessedNumber: string) => {
    let plusOne = 0;
    let minusOne = 0;

    for (let i = 0; i < 4; i++) {
      if (guessedNumber[i] === holdingNumber[i]) {
        plusOne++;
      } else if (holdingNumber.includes(guessedNumber[i])) {
        minusOne++;
      }
    }

    return { plusOne, minusOne };
  };

  const [holdingNumber, setHoldingNumber] = useState<string>(
    generateRandomNumber().toString()
  );

  const [guessedNumber, setGuessedNumber] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);

  const [guessHistory, setGuessHistory] = useState<
    { number: string; feedback: string }[]
  >([]);

  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [holdingNumberGenerated, setHoldingNumberGenerated] =
    useState<boolean>(true);

  const handleCodeChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newNumber = event.target.value.slice(-1);

    if (index === 0 && newNumber === "0") {
      return;
    }

    const newGuessedNumber = [...guessedNumber];
    newGuessedNumber[index] = newNumber;

    if (newGuessedNumber.indexOf(newNumber, 0) !== index) {
      return;
    }

    setGuessedNumber(newGuessedNumber);

    if (newNumber >= "0" && newNumber <= "9") {
      if (index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmitGuess = () => {
    if (guessedNumber.some((num) => num === "")) {
      return;
    }
    const feedback = calculateFeedback(holdingNumber, guessedNumber.join(""));
    const newGuessHistory = [
      ...guessHistory,
      {
        number: guessedNumber.join(""),
        feedback: `+${feedback.plusOne}, -${feedback.minusOne}`,
      },
    ];
    if (guessedNumber.length === 4) {
      setGuessHistory(newGuessHistory);
    }

    if (feedback.plusOne === 4) {
      setHoldingNumberGenerated(false);
    }
    setGuessedNumber(["", "", "", ""]);
  };

  const handleNewGame = () => {
    setHoldingNumber(generateRandomNumber().toString());
    setGuessHistory([]);
    setGuessedNumber(["", "", "", ""]);
    setHoldingNumberGenerated(true);
  };
  if (!holdingNumberGenerated) {
    let message = "";
    const attempts = guessHistory.length;

    if (attempts < 4) {
      message = `Wow! You found the number "${holdingNumber}" in ${attempts} attempts. Impressive!`;
    } else if (attempts >= 4 && attempts <= 8) {
      message = `Great job! It took you only ${attempts} tries to find the number "${holdingNumber}".`;
    } else if (attempts > 8 && attempts <= 12) {
      message = `Congratulations! You found the number "${holdingNumber}" in just ${attempts} attempts.`;
    } else {
      message = `Hmm! You found the number "${holdingNumber}" in ${attempts} attempts. Better next time, huh?`;
    }

    return (
      <div className="app">
        <div className="container">
          <p className="message">{message}</p>
          <button className="messageBtn" onClick={handleNewGame}>
            Play New Game
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="app">
      <div className="container">
        <p className="feedback">
          Guess the number{" "}
          <FontAwesomeIcon icon={faCircleInfo} className="icon" />
          <span className="tooltip">
            The first digit must not be 0. <br />
            Do not use the same number more than once.
          </span>
        </p>
        <div className="boxes">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index}>
              <input
                type="number"
                autoComplete="off"
                aria-label={`Number ${index + 1} of 4`}
                aria-required={true}
                maxLength={1}
                value={guessedNumber[index]}
                onChange={(event) => handleCodeChange(index, event)}
                ref={(el) =>
                  (inputRefs.current[index] = el as HTMLInputElement)
                }
                className="box"
              />
            </div>
          ))}
        </div>
        <div className="buttons">
          <button className="btn" onClick={handleSubmitGuess}>
            Submit Guess
          </button>
          {guessHistory.length > 0 && (
            <button className="btn newGameBtn" onClick={handleNewGame}>
              New Game
            </button>
          )}
        </div>
        {guessHistory.length > 0 && (
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>Your Guess</th>
                  <th className="feedback">
                    Feedback{" "}
                    <FontAwesomeIcon icon={faCircleInfo} className="icon" />
                    <span className="tooltip">
                      +X: Correct digit, in correct position.
                      <br />
                      -Y: Correct digit, but in wrong position.
                    </span>
                  </th>
                </tr>
              </thead>
              {guessHistory.map((guess, index) => (
                <tbody key={index}>
                  <tr>
                    <td>{guess.number}</td>
                    <td> {guess.feedback}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
