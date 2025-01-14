#include "woff2_c.hpp"

extern "C"
{
  size_t MaxWOFF2CompressedSize(const uint8_t *data, size_t length)
  {
    return woff2::MaxWOFF2CompressedSize(data, length);
  }

  bool ConvertTTFToWOFF2(const uint8_t *data, size_t length,
                         uint8_t *result, size_t *result_length, Woff2EncodeParams params)
  {
    if (!data || !length || !result || !result_length) {
      return false;
    }
    woff2::WOFF2Params woff2_params;
    woff2_params.allow_transforms = params.allow_transforms;
    woff2_params.brotli_quality = params.brotli_quality;
    if (params.extended_metadata) {
      woff2_params.extended_metadata = std::string(params.extended_metadata);
    }
    return woff2::ConvertTTFToWOFF2(data, length, result, result_length, woff2_params);
  }

  bool ConvertWOFF2ToTTF(
      const uint8_t *data, size_t length, Woff2MemoryOut *out)
  {
    if (!data || !length || !out) {
      return false;
    }

    std::allocator<uint8_t> alloc;
    size_t result_length = woff2::ComputeWOFF2FinalSize(data, length);
    if (result_length == 0)
    {
      return false;
    }
    // the actually size could be larger than the `result_length`, give it a little more space
    uint8_t *result = alloc.allocate(result_length + 4096);
    auto memory_out = new woff2::WOFF2MemoryOut(result, result_length + 4096);
    out->inner = reinterpret_cast<Woff2MemoryOutInner *>(memory_out);
    out->data = result;
    out->length = result_length;
    return woff2::ConvertWOFF2ToTTF(data, length, memory_out);
  }

  void FreeMemoryOutput(Woff2MemoryOutInner *out)
  {
    delete reinterpret_cast<woff2::WOFF2MemoryOut *>(out);
  }
}
