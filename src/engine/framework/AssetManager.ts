import Log from "./Log";

const TAG = "AssetManager";

class AssetManager {
  private static instance: AssetManager;
  private images: Map<string, HTMLImageElement> = new Map();
  private constructor() {}

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src;
      image.alt = src;

      image.onload = () => {
        resolve(image);
      };

      image.onerror = (err) => {
        reject(err);
      };
    });
  }

  async getImage(src: string) {
    const image = this.images.get(src);
    if (image) return Promise.resolve(image);

    try {
      const imageElement = await this.loadImage(src);
      this.images.set(src, imageElement);
      return imageElement;
    } catch (error) {
      Log.error(TAG, "Failed to load image: ", error);
    }
  }

  async getMultipleImages(
    paths: string[]
  ): Promise<Record<string, HTMLImageElement>> {
    const images = {} as Record<string, HTMLImageElement>;

    const notLoadedPaths = paths.map((path) => {
      const image = this.images.get(path);
      if (image) {
        images[path] = image;
        return;
      }

      return path;
    });

    if (notLoadedPaths.length === 0) {
      return Promise.resolve(images);
    }

    const promises = notLoadedPaths.map((path) => {
      if (path) {
        return this.loadImage(path);
      }
    });

    try {
      const loadedImages = await Promise.all(promises);

      if (loadedImages.length) {
        loadedImages.forEach((image) => {
          if (image?.alt) {
            images[image.alt] = image;
          }
        });
      }

      return images;
    } catch (error) {
      Log.error(TAG, "Failed to load multiple images", error);
      return {};
    }
  }

  preloadImages = (sources: string[]) => {
    sources.forEach((src) => {
      this.loadImage(src)
        .then((image) => {
          if (image) {
            this.images.set(src, image);
          } else {
            Log.error(TAG, "No images under: ", src);
          }
        })
        .catch((error) => {
          Log.error(TAG, "Failed to load a image: " + src, error);
        });
    });
  };

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new AssetManager();
    return this.instance;
  }
}

export default AssetManager.getInstance();
