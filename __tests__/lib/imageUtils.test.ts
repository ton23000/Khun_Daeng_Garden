import { getFirstImageUrl, getAllImageUrls } from "@/lib/imageUtils";

describe("Image Utility Functions", () => {
  describe("getFirstImageUrl", () => {
    it("should return placeholder for null or undefined", () => {
      expect(getFirstImageUrl(null)).toBe("/placeholder-tree.svg");
      expect(getFirstImageUrl(undefined)).toBe("/placeholder-tree.svg");
    });

    it("should return the first element if data is an array", () => {
      const images = ["/image1.jpg", "/image2.jpg"];
      expect(getFirstImageUrl(images)).toBe("/image1.jpg");
    });

    it("should parse json string and return first element", () => {
      const jsonString = JSON.stringify(["/image1.jpg", "/image2.jpg"]);
      expect(getFirstImageUrl(jsonString)).toBe("/image1.jpg");
    });

    it("should return the string itself if it cannot be parsed but is a single string", () => {
      expect(getFirstImageUrl("/single-image.jpg")).toBe("/single-image.jpg");
    });
  });

  describe("getAllImageUrls", () => {
    it("should return empty array for null or undefined", () => {
      expect(getAllImageUrls(null)).toEqual([]);
      expect(getAllImageUrls(undefined)).toEqual([]);
    });

    it("should return the array if data is already an array", () => {
      const images = ["/image1.jpg", "/image2.jpg"];
      expect(getAllImageUrls(images)).toEqual(["/image1.jpg", "/image2.jpg"]);
    });

    it("should parse json string and return array", () => {
      const jsonString = JSON.stringify(["/image1.jpg", "/image2.jpg"]);
      expect(getAllImageUrls(jsonString)).toEqual([
        "/image1.jpg",
        "/image2.jpg",
      ]);
    });

    it("should wrap string in array if it is a URL or absolute path", () => {
      expect(getAllImageUrls("http://example.com/img.jpg")).toEqual([
        "http://example.com/img.jpg",
      ]);
      expect(getAllImageUrls("/local-img.jpg")).toEqual(["/local-img.jpg"]);
    });

    it("should return empty array for invalid JSON string that is not a URL", () => {
      expect(getAllImageUrls("invalid-json")).toEqual([]);
    });
  });
});
