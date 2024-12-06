#[doc(hidden)]
#[allow(non_snake_case)]
pub unsafe fn _export_get_tokens_cabi<T: Guest>(arg0: *mut u8, arg1: usize) -> *mut u8 {
    #[cfg(target_arch = "wasm32")] _rt::run_ctors_once();
    let len0 = arg1;
    let bytes0 = _rt::Vec::from_raw_parts(arg0.cast(), len0, len0);
    let result1 = T::get_tokens(_rt::string_lift(bytes0));
    let ptr2 = _RET_AREA.0.as_mut_ptr().cast::<u8>();
    let vec3 = (result1.into_bytes()).into_boxed_slice();
    let ptr3 = vec3.as_ptr().cast::<u8>();
    let len3 = vec3.len();
    ::core::mem::forget(vec3);
    *ptr2.add(4).cast::<usize>() = len3;
    *ptr2.add(0).cast::<*mut u8>() = ptr3.cast_mut();
    ptr2
}
#[doc(hidden)]
#[allow(non_snake_case)]
pub unsafe fn __post_return_get_tokens<T: Guest>(arg0: *mut u8) {
    let l0 = *arg0.add(0).cast::<*mut u8>();
    let l1 = *arg0.add(4).cast::<usize>();
    _rt::cabi_dealloc(l0, l1, 1);
}
#[doc(hidden)]
#[allow(non_snake_case)]
pub unsafe fn _export_get_ast_cabi<T: Guest>(arg0: *mut u8, arg1: usize) -> *mut u8 {
    #[cfg(target_arch = "wasm32")] _rt::run_ctors_once();
    let len0 = arg1;
    let bytes0 = _rt::Vec::from_raw_parts(arg0.cast(), len0, len0);
    let result1 = T::get_ast(_rt::string_lift(bytes0));
    let ptr2 = _RET_AREA.0.as_mut_ptr().cast::<u8>();
    let vec3 = (result1.into_bytes()).into_boxed_slice();
    let ptr3 = vec3.as_ptr().cast::<u8>();
    let len3 = vec3.len();
    ::core::mem::forget(vec3);
    *ptr2.add(4).cast::<usize>() = len3;
    *ptr2.add(0).cast::<*mut u8>() = ptr3.cast_mut();
    ptr2
}
#[doc(hidden)]
#[allow(non_snake_case)]
pub unsafe fn __post_return_get_ast<T: Guest>(arg0: *mut u8) {
    let l0 = *arg0.add(0).cast::<*mut u8>();
    let l1 = *arg0.add(4).cast::<usize>();
    _rt::cabi_dealloc(l0, l1, 1);
}
#[doc(hidden)]
#[allow(non_snake_case)]
pub unsafe fn _export_hello_world_cabi<T: Guest>() -> *mut u8 {
    #[cfg(target_arch = "wasm32")] _rt::run_ctors_once();
    let result0 = T::hello_world();
    let ptr1 = _RET_AREA.0.as_mut_ptr().cast::<u8>();
    let vec2 = (result0.into_bytes()).into_boxed_slice();
    let ptr2 = vec2.as_ptr().cast::<u8>();
    let len2 = vec2.len();
    ::core::mem::forget(vec2);
    *ptr1.add(4).cast::<usize>() = len2;
    *ptr1.add(0).cast::<*mut u8>() = ptr2.cast_mut();
    ptr1
}
#[doc(hidden)]
#[allow(non_snake_case)]
pub unsafe fn __post_return_hello_world<T: Guest>(arg0: *mut u8) {
    let l0 = *arg0.add(0).cast::<*mut u8>();
    let l1 = *arg0.add(4).cast::<usize>();
    _rt::cabi_dealloc(l0, l1, 1);
}
pub trait Guest {
    fn get_tokens(source: _rt::String) -> _rt::String;
    fn get_ast(source: _rt::String) -> _rt::String;
    fn hello_world() -> _rt::String;
}
#[doc(hidden)]
macro_rules! __export_world_example_cabi {
    ($ty:ident with_types_in $($path_to_types:tt)*) => {
        const _ : () = { #[export_name = "get-tokens"] unsafe extern "C" fn
        export_get_tokens(arg0 : * mut u8, arg1 : usize,) -> * mut u8 {
        $($path_to_types)*:: _export_get_tokens_cabi::<$ty > (arg0, arg1) } #[export_name
        = "cabi_post_get-tokens"] unsafe extern "C" fn _post_return_get_tokens(arg0 : *
        mut u8,) { $($path_to_types)*:: __post_return_get_tokens::<$ty > (arg0) }
        #[export_name = "get-ast"] unsafe extern "C" fn export_get_ast(arg0 : * mut u8,
        arg1 : usize,) -> * mut u8 { $($path_to_types)*:: _export_get_ast_cabi::<$ty >
        (arg0, arg1) } #[export_name = "cabi_post_get-ast"] unsafe extern "C" fn
        _post_return_get_ast(arg0 : * mut u8,) { $($path_to_types)*::
        __post_return_get_ast::<$ty > (arg0) } #[export_name = "hello-world"] unsafe
        extern "C" fn export_hello_world() -> * mut u8 { $($path_to_types)*::
        _export_hello_world_cabi::<$ty > () } #[export_name = "cabi_post_hello-world"]
        unsafe extern "C" fn _post_return_hello_world(arg0 : * mut u8,) {
        $($path_to_types)*:: __post_return_hello_world::<$ty > (arg0) } };
    };
}
#[doc(hidden)]
pub(crate) use __export_world_example_cabi;
#[repr(align(4))]
struct _RetArea([::core::mem::MaybeUninit<u8>; 8]);
static mut _RET_AREA: _RetArea = _RetArea([::core::mem::MaybeUninit::uninit(); 8]);
mod _rt {
    #[cfg(target_arch = "wasm32")]
    pub fn run_ctors_once() {
        wit_bindgen_rt::run_ctors_once();
    }
    pub use alloc_crate::vec::Vec;
    pub unsafe fn string_lift(bytes: Vec<u8>) -> String {
        if cfg!(debug_assertions) {
            String::from_utf8(bytes).unwrap()
        } else {
            String::from_utf8_unchecked(bytes)
        }
    }
    pub unsafe fn cabi_dealloc(ptr: *mut u8, size: usize, align: usize) {
        if size == 0 {
            return;
        }
        let layout = alloc::Layout::from_size_align_unchecked(size, align);
        alloc::dealloc(ptr, layout);
    }
    pub use alloc_crate::string::String;
    extern crate alloc as alloc_crate;
    pub use alloc_crate::alloc;
}
/// Generates `#[no_mangle]` functions to export the specified type as the
/// root implementation of all generated traits.
///
/// For more information see the documentation of `wit_bindgen::generate!`.
///
/// ```rust
/// # macro_rules! export{ ($($t:tt)*) => (); }
/// # trait Guest {}
/// struct MyType;
///
/// impl Guest for MyType {
///     // ...
/// }
///
/// export!(MyType);
/// ```
#[allow(unused_macros)]
#[doc(hidden)]
macro_rules! __export_example_impl {
    ($ty:ident) => {
        self::export!($ty with_types_in self);
    };
    ($ty:ident with_types_in $($path_to_types_root:tt)*) => {
        $($path_to_types_root)*:: __export_world_example_cabi!($ty with_types_in
        $($path_to_types_root)*);
    };
}
#[doc(inline)]
pub(crate) use __export_example_impl as export;
#[cfg(target_arch = "wasm32")]
#[link_section = "component-type:wit-bindgen:0.35.0:component:tools:example:encoded world"]
#[doc(hidden)]
pub static __WIT_BINDGEN_COMPONENT_TYPE: [u8; 220] = *b"\
\0asm\x0d\0\x01\0\0\x19\x16wit-component-encoding\x04\0\x07_\x01A\x02\x01A\x05\x01\
@\x01\x06sources\0s\x04\0\x0aget-tokens\x01\0\x04\0\x07get-ast\x01\0\x01@\0\0s\x04\
\0\x0bhello-world\x01\x01\x04\0\x17component:tools/example\x04\0\x0b\x0d\x01\0\x07\
example\x03\0\0\0G\x09producers\x01\x0cprocessed-by\x02\x0dwit-component\x070.22\
0.0\x10wit-bindgen-rust\x060.35.0";
#[inline(never)]
#[doc(hidden)]
pub fn __link_custom_section_describing_imports() {
    wit_bindgen_rt::maybe_link_cabi_realloc();
}
