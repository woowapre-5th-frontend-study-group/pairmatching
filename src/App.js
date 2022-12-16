const InputView = require("./View/InputView");
const OutputView = require("./View/OutputView");
const PairMatching = require("./Model/PairMatching");
const { TASK_NUMBER } = require("./constant/value");
const { MissionUtils } = require("@woowacourse/mission-utils");

class App {
  #pairMatching;

  getPairMatching() {
    return this.#pairMatching;
  }

  play() {
    this.#pairMatching = new PairMatching();
    InputView.readTask(this.#readTaskCallback);
  }

  #controller() {
    if (this.#pairMatching.getTask() == "match") this.#match();
    else if (this.#pairMatching.getTask() == "search") this.#search();
    else if (this.#pairMatching.getTask() == "init") this.#init();
    else if (this.#pairMatching.getTask() == "quit") this.#quit();
  }

  #match() {
    OutputView.printCrewInfo();
    InputView.readOptions(this.#readOptionsForMatchCallback);
  }

  #search() {
    OutputView.printCrewInfo();
    InputView.readOptions(this.#readOptionsForSearchCallback);
  }

  #init() {
    this.#pairMatching.init();
    InputView.readTask(this.#readTaskCallback);
  }

  #quit() {
    this.#pairMatching.quit();
  }

  #readTaskCallback = (task) => {
    this.#pairMatching.setTask(TASK_NUMBER[task]);
    this.#controller();
  };

  #readOptionsForMatchCallback = (options) => {
    this.#pairMatching.setCurrentOptions(options);

    if (this.#pairMatching.isAvailableMatch()) {
      const matchResult = this.#pairMatching.match();
      OutputView.printMatchResult(matchResult);
      InputView.readTask(this.#readTaskCallback);
    } else {
      InputView.readReMatchOption(this.#readReMatchOptionCallback);
    }
  };

  #readOptionsForSearchCallback = (options) => {
    this.#pairMatching.setCurrentPairInfo(options);

    console.log("**" + this.#pairMatching.getPairList().length);
    console.log(JSON.stringify(this.#pairMatching.getPairList()[0]));
    const t = this.#pairMatching.searchMatchResult();
    OutputView.printPairMatchResult(t);
    InputView.readTask(this.#readTaskCallback);
  };

  #readReMatchOptionCallback = (option) => {
    if (option == "네") {
      this.#pairMatching.reMatch();
      const matchResult = this.#pairMatching.match();
      OutputView.printMatchResult(matchResult);
      InputView.readTask(this.#readTaskCallback);
    }
    if (option == "아니오") {
      MissionUtils.Console.print("");
      InputView.readOptions(this.#readOptionsForMatchCallback);
    }
  };
}

module.exports = App;
