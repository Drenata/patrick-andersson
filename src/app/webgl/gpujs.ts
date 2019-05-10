import { Kernel } from 'gpu.js';

/**
 * Workaround to resize a graphical kernel
 *
 * @param kernel
 * @param width
 * @param height
 */
export function resizeGraphicalKernel(kernel: Kernel, width: number, height: number) {
    kernel.context.viewport(0, 0, width, height);
    //@ts-ignore
    kernel.texSize = [width, height];
    //@ts-ignore
    kernel.maxTexSize = [width, height];
    //@ts-ignore
    kernel.framebuffer.width = width;
    //@ts-ignore
    kernel.framebuffer.height = height;
    //@ts-ignore
    kernel.threadDim = [width, height, 1];
}