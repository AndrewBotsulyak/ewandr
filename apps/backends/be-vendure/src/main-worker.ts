import { bootstrapWorker } from '@vendure/core';
import {config} from "./vendure-config";

bootstrapWorker(config)
  .then(worker => worker.startJobQueue())
  .catch(err => {
    console.log('Worker bootstrap error:', err);
    process.exit(1);
  });
