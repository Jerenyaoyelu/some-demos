import Tesseract, { Lang, Scheduler, Worker } from 'tesseract.js';

const { createWorker, createScheduler } = Tesseract;

export interface RectProp {
  left: number;
  top: number;
  width: number;
  height: number;
}

class TesseractScheduler {
  scheduler: Scheduler;
  rectangles: RectProp[] = [];

  constructor() {
    this.scheduler = createScheduler();
  }

  async initWorker(
    lang: string | Lang[],
    logger?: (m: string) => void
  ): Promise<Tesseract.Worker> {
    const worker = await createWorker({
      logger: (m) => {
        logger?.(m);
      },
    });
    await worker.loadLanguage(lang);
    await worker.initialize(lang);
    return worker;
  }

  setRectangles(rect: RectProp[]) {
    this.rectangles = rect;
  }

  async setWorkers(
    lang: string | Lang[],
    opts?: {
      workerNums?: number;
      logger?: (m: string) => void;
    }
  ) {
    const { workerNums, logger } = opts!;
    for (let i = 0; i < (workerNums || 2); i += 1) {
      const worker = await this.initWorker(lang, logger);
      this.scheduler.addWorker(worker);
    }
  }

  async detect(src: string) {
    const workerNums = this.scheduler.getNumWorkers();
    if (!workerNums) {
      return new Error('Pls init worker first');
    }
    const res = await this.scheduler.addJob('detect', src);
    return res;
  }

  async recognize(src: string): Promise<Tesseract.RecognizeResult[] | Error> {
    const workerNums = this.scheduler.getNumWorkers();
    if (!workerNums) {
      return new Error('Pls init worker first');
    }
    const promises = [];
    if (this.rectangles.length) {
      this.rectangles.forEach((rectangle) => {
        promises.push(this.scheduler.addJob('recognize', src, { rectangle }));
      });
    } else {
      promises.push(this.scheduler.addJob('recognize', src));
    }
    const results = await Promise.all(promises);
    return results;
  }

  async terminate() {
    await this.scheduler.terminate();
  }
}

export default new TesseractScheduler();
