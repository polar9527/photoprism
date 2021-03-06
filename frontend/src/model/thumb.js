import Model from "./model";

const thumbs = window.clientConfig.thumbnails;

class Thumb extends Model {
    getDefaults() {
        return {
            uuid: "",
            title: "",
            original_w: "",
            original_h: "",
            download_url: "",
        };
    }

    static fromPhotos(photos) {
        let result = [];

        photos.forEach((p) => {
            result.push(this.fromPhoto(p));
        });

        return result;
    }

    static fromPhoto(photo) {
        if (photo.Files) {
            return this.fromFile(photo, photo.Files.find(f => !!f.FilePrimary));
        }

        const result = {
            uuid: photo.PhotoUUID,
            title: photo.PhotoTitle,
            download_url: "/api/v1/download/" + photo.FileHash,
            original_w: photo.FileWidth,
            original_h: photo.FileHeight,
        };

        for (let i = 0; i < thumbs.length; i++) {
            let size = photo.calculateSize(thumbs[i].Width, thumbs[i].Height);

            result[thumbs[i].Name] = {
                src: photo.getThumbnailUrl(thumbs[i].Name),
                w: size.width,
                h: size.height,
            };
        }

        return new this(result);
    }

    static fromFile(photo, file) {
        const result = {
            uuid: photo.PhotoUUID,
            title: photo.PhotoTitle,
            download_url: "/api/v1/download/" + file.FileHash,
            original_w: file.FileWidth,
            original_h: file.FileHeight,
        };

        thumbs.forEach((t) => {
            let size = this.calculateSize(file, t.Width, t.Height);

            result[t.Name] = {
                src: this.thumbnailUrl(file, t.Name),
                w: size.width,
                h: size.height,
            };
        });

        return new this(result);
    }

    static fromFiles(photos) {
        let result = [];

        photos.forEach((p) => {
            if (!p.Files) return;

            p.Files.forEach((f) => {
                    if (f.FileType === 'jpg') {
                        result.push(this.fromFile(p, f));
                    }
                }
            );
        });

        return result;
    }

    static calculateSize(file, width, height) {
        if (width >= file.FileWidth && height >= file.FileHeight) { // Smaller
            return {width: file.FileWidth, height: file.FileHeight};
        }

        const srcAspectRatio = file.FileWidth / file.FileHeight;
        const maxAspectRatio = width / height;

        let newW, newH;

        if (srcAspectRatio > maxAspectRatio) {
            newW = width;
            newH = Math.round(newW / srcAspectRatio);

        } else {
            newH = height;
            newW = Math.round(newH * srcAspectRatio);
        }

        return {width: newW, height: newH};
    }

    static thumbnailUrl(file, type) {
        if (!file.FileHash) {
            return "/api/v1/svg/photo";

        }

        return "/api/v1/thumbnails/" + file.FileHash + "/" + type;
    }
}

export default Thumb;
