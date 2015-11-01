import Kernel from './Kernel/Kernel';

export default function(robot) {
    setTimeout(() => {
        let kernel = new Kernel(robot);

        return kernel.run();
    }, 1000);
}